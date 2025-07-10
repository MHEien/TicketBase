import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { Department } from './entities/department.entity';
import { Organization } from './entities/organization.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { OrganizationsService } from './organizations.service';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Department, Organization]),
    ActivitiesModule,
  ],
  controllers: [UsersController, DepartmentsController],
  providers: [UsersService, DepartmentsService, OrganizationsService],
  exports: [UsersService, DepartmentsService, OrganizationsService],
})
export class UsersModule {}
