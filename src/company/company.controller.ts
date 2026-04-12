/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseUUIDPipe,  Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompany } from './dtos/CreateCompany.dto';
import { JwtGuard } from '../user/gurards/jwt.guard';
import { User } from './decorators/user.decorator';
import * as interfaces from '../../utils/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam,  ApiTags } from '@nestjs/swagger';
@UseGuards(JwtGuard)
@Controller('company')
@ApiTags('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
   
  @Post()
  @ApiOperation({ summary: 'create new company' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCompany })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  public async create(@Body() dto:CreateCompany,@User() user:interfaces.Payload,
  @UploadedFile() image?:Express.Multer.File
) {

    const result = await this.companyService.createCompany(dto,user.id,image);
    return result;
    

  }
  @Get(":companyId")
  @ApiParam({ name: 'companyId', type:String})
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get company dashboard information' })
  public async companyDashboardInfo(
    @Param("companyId", new ParseUUIDPipe()) companyId:string ,
    @Req() req:Request
  ) {
    const user = req.user as interfaces.Payload;
    const result = await this.companyService.getDashboardInfo(companyId,user.id)
    return result ;

  }










    

  

}
