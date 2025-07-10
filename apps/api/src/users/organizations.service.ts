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
