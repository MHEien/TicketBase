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
    await this.organizationsRepository.update(id, data);
    return this.findById(id);
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

    organization.settings = {
      ...organization.settings,
      ...settings,
    };

    return this.organizationsRepository.save(organization);
  }

  async upgradeOrganizationPlan(
    id: string,
    plan: PlanType,
  ): Promise<Organization> {
    await this.organizationsRepository.update(id, { plan });
    return this.findById(id);
  }
}
