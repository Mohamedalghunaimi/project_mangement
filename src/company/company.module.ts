/* eslint-disable prettier/prettier */
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TeamModule } from 'src/team/team.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports:[
    TeamModule,

  ]
})
export class CompanyModule {}
