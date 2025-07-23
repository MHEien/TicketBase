import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PublicPagesController } from './public-pages.controller';
import { ActivitiesService } from '../activities/activities.service';
import { Activity } from '../activities/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Activity])],
  controllers: [PagesController, PublicPagesController],
  providers: [PagesService, ActivitiesService],
  exports: [PagesService],
})
export class PagesModule {}
