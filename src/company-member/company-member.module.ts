import { Module } from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CompanyMemberController } from './company-member.controller';

@Module({
  controllers: [CompanyMemberController],
  providers: [CompanyMemberService],
})
export class CompanyMemberModule {}
