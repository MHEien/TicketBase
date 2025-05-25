import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';
import { UsersService } from './users.service';
import { OrganizationsService } from './organizations.service';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Organization, Department]),
  ],
  controllers: [DepartmentsController],
  providers: [UsersService, OrganizationsService, DepartmentsService],
  exports: [UsersService, OrganizationsService, DepartmentsService],
})
export class UsersModule {}
