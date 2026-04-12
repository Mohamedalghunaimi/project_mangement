import { PartialType } from '@nestjs/swagger';
import { CreateCompanyMemberDto } from './create-company-member.dto';

export class UpdateCompanyMemberDto extends PartialType(CreateCompanyMemberDto) {}
