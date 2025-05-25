import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { Organization } from './entities/organization.entity';
import { UsersService } from './users.service';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Organization]),
  ],
  providers: [UsersService, OrganizationsService],
  exports: [UsersService, OrganizationsService],
})
export class UsersModule {}
