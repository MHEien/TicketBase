import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, PlanType } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  async findById(id: string): Promise<Organization | null> {
    return this.organizationsRepository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.organizationsRepository.findOne({ where: { slug } });
  }

  async findByDomain(domain: string): Promise<Organization | null> {
    // Remove protocol and www if present
    const cleanDomain = domain
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .toLowerCase();

    return this.organizationsRepository.findOne({
      where: {
        customDomain: cleanDomain,
        domainVerified: true,
      },
    });
  }

  async findByDomainIncludeUnverified(
    domain: string,
  ): Promise<Organization | null> {
    // Remove protocol and www if present
    const cleanDomain = domain
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .toLowerCase();

    return this.organizationsRepository.findOne({
      where: {
        customDomain: cleanDomain,
      },
    });
  }

  async verifyDomainOwnership(organizationId: string): Promise<boolean> {
    const organization = await this.findById(organizationId);

    if (
      !organization ||
      !organization.customDomain ||
      !organization.domainVerificationToken
    ) {
      return false;
    }

    try {
      // Method 1: Check for TXT record with verification token
      const txtRecordName = `_verify-${organization.domainVerificationToken}`;
      const isVerifiedByTxt = this.checkTxtRecord(
        organization.customDomain,
        txtRecordName,
      );

      if (isVerifiedByTxt) {
        // Update domain as verified
        await this.updateOrganization(organizationId, { domainVerified: true });
        return true;
      }

      // Method 2: Check for meta tag on domain root
      const isVerifiedByMeta = await this.checkMetaTagVerification(
        organization.customDomain,
        organization.domainVerificationToken,
      );

      if (isVerifiedByMeta) {
        // Update domain as verified
        await this.updateOrganization(organizationId, { domainVerified: true });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Domain verification error:', error);
      return false;
    }
  }

  private checkTxtRecord(domain: string, txtRecordName: string): boolean {
    try {
      // In a real implementation, you would use DNS resolution
      // For now, we'll simulate this check
      // You could use libraries like 'dns' module or external services

      // Simulated check - in production, implement actual DNS TXT record lookup
      console.log(`Checking TXT record: ${txtRecordName}.${domain}`);

      // This would be replaced with actual DNS lookup:
      // const dns = require('dns').promises;
      // const txtRecords = await dns.resolveTxt(`${txtRecordName}.${domain}`);
      // return txtRecords.some(record => record.includes(expectedToken));

      return false; // For now, always return false until real DNS is implemented
    } catch (error) {
      console.error('TXT record check error:', error);
      return false;
    }
  }

  private async checkMetaTagVerification(
    domain: string,
    token: string,
  ): Promise<boolean> {
    try {
      // Check for meta tag verification by fetching the domain root
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`https://${domain}/`, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'TicketPlatform-DomainVerification/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // In a real implementation, you'd parse the HTML and look for:
        // <meta name="ticket-platform-domain-verification" content="TOKEN" />

        // For now, we'll implement a simple verification file check instead
        return await this.checkVerificationFile(domain, token);
      }

      return false;
    } catch (error) {
      console.error('Meta tag verification error:', error);
      return false;
    }
  }

  private async checkVerificationFile(
    domain: string,
    token: string,
  ): Promise<boolean> {
    try {
      // Check for verification file at domain/.well-known/ticket-platform-verification
      const verificationUrl = `https://${domain}/.well-known/ticket-platform-verification`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(verificationUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'TicketPlatform-DomainVerification/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const content = await response.text();
        return content.trim() === token;
      }

      return false;
    } catch (error) {
      console.error('Verification file check error:', error);
      return false;
    }
  }

  async generateDomainVerificationToken(
    organizationId: string,
  ): Promise<string> {
    const token = crypto.randomUUID();
    await this.updateOrganization(organizationId, {
      domainVerificationToken: token,
      domainVerified: false, // Reset verification status when generating new token
    });
    return token;
  }

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const newOrganization = this.organizationsRepository.create({
      ...data,
      settings: {
        defaultCurrency: 'USD',
        emailNotifications: true,
        allowGuestCheckout: true,
        serviceFeePercentage: 0,
        serviceFeeFixed: 0,
        ticketTransfersEnabled: true,
        ...data.settings,
      },
    });

    return this.organizationsRepository.save(newOrganization);
  }

  async updateOrganization(
    id: string,
    data: Partial<Organization>,
  ): Promise<Organization> {
    // If settings are being updated, handle them separately to enable deep merge
    if (data.settings) {
      const settingsData = data.settings;
      delete data.settings;

      // Update other fields first
      if (Object.keys(data).length > 0) {
        await this.organizationsRepository.update(id, data);
      }

      // Then update settings with deep merge
      return this.updateOrganizationSettings(id, settingsData);
    } else {
      await this.organizationsRepository.update(id, data);
      return this.findById(id);
    }
  }

  async getOrganizationSettings(id: string): Promise<any> {
    const organization = await this.findById(id);
    return organization ? organization.settings : null;
  }

  async updateOrganizationSettings(
    id: string,
    settings: any,
  ): Promise<Organization> {
    const organization = await this.findById(id);

    if (!organization) {
      return null;
    }

    // Deep merge settings to handle nested objects like brandSettings, details, etc.
    organization.settings = this.deepMerge(
      organization.settings || {},
      settings,
    );

    return this.organizationsRepository.save(organization);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  async upgradeOrganizationPlan(
    id: string,
    plan: PlanType,
  ): Promise<Organization> {
    await this.organizationsRepository.update(id, { plan });
    return this.findById(id);
  }
}
