import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // Check if slug is already in use within the organization
    const existingDepartment = await this.departmentsRepository.findOne({
      where: {
        slug: createDepartmentDto.slug,
        organizationId: createDepartmentDto.organizationId,
      },
    });

    if (existingDepartment) {
      throw new BadRequestException(
        `Department with slug '${createDepartmentDto.slug}' already exists in this organization`,
      );
    }

    // Create department entity
    const department = this.departmentsRepository.create(createDepartmentDto);

    // Save and return department
    return this.departmentsRepository.save(department);
  }

  async findAll(organizationId: string): Promise<Department[]> {
    return this.departmentsRepository.find({
      where: { organizationId },
      relations: ['parentDepartment', 'childDepartments'],
    });
  }

  async findAllWithUsers(organizationId: string): Promise<Department[]> {
    return this.departmentsRepository.find({
      where: { organizationId },
      relations: ['parentDepartment', 'childDepartments', 'users'],
    });
  }

  async findOne(id: string, organizationId?: string): Promise<Department> {
    const queryOptions: any = {
      where: { id },
      relations: ['parentDepartment', 'childDepartments', 'users'],
    };

    // If organizationId is provided, use it to restrict access
    if (organizationId) {
      queryOptions.where.organizationId = organizationId;
    }

    const department = await this.departmentsRepository.findOne(queryOptions);

    if (!department) {
      throw new NotFoundException(`Department with ID '${id}' not found`);
    }

    return department;
  }

  async findBySlug(slug: string, organizationId: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { slug, organizationId },
      relations: ['parentDepartment', 'childDepartments', 'users'],
    });

    if (!department) {
      throw new NotFoundException(`Department with slug '${slug}' not found`);
    }

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    organizationId?: string,
  ): Promise<Department> {
    // First check if department exists
    const department = await this.findOne(id, organizationId);

    // Check if slug is being updated and if it's already in use
    if (
      updateDepartmentDto.slug &&
      updateDepartmentDto.slug !== department.slug
    ) {
      const existingDepartment = await this.departmentsRepository.findOne({
        where: {
          slug: updateDepartmentDto.slug,
          organizationId: department.organizationId,
          id: Not(id),
        },
      });

      if (existingDepartment) {
        throw new BadRequestException(
          `Department with slug '${updateDepartmentDto.slug}' already exists in this organization`,
        );
      }
    }

    // Update department
    const updatedDepartment = { ...department, ...updateDepartmentDto };

    // Save and return updated department
    return this.departmentsRepository.save(updatedDepartment);
  }

  async remove(id: string, organizationId?: string): Promise<void> {
    // First check if department exists
    const department = await this.findOne(id, organizationId);

    // Check if department has child departments
    if (department.childDepartments && department.childDepartments.length > 0) {
      throw new BadRequestException(
        'Cannot delete department with child departments',
      );
    }

    // Check if department has users
    if (department.users && department.users.length > 0) {
      throw new BadRequestException(
        'Cannot delete department with assigned users',
      );
    }

    // Delete department
    await this.departmentsRepository.remove(department);
  }

  async getHierarchy(organizationId: string): Promise<Department[]> {
    // Get all top-level departments (no parent)
    const rootDepartments = await this.departmentsRepository.find({
      where: { organizationId, parentDepartmentId: null },
      relations: ['childDepartments'],
    });

    // For each root department, recursively load its child departments
    for (const rootDept of rootDepartments) {
      await this.loadChildDepartments(rootDept);
    }

    return rootDepartments;
  }

  private async loadChildDepartments(department: Department): Promise<void> {
    if (
      !department.childDepartments ||
      department.childDepartments.length === 0
    ) {
      return;
    }

    for (const childDept of department.childDepartments) {
      // Load the full child department entity with its own children
      const fullChildDept = await this.departmentsRepository.findOne({
        where: { id: childDept.id },
        relations: ['childDepartments'],
      });

      // Replace the minimal child reference with the full entity
      Object.assign(childDept, fullChildDept);

      // Recursively load grandchildren
      await this.loadChildDepartments(childDept);
    }
  }
}
