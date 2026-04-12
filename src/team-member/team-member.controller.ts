/* eslint-disable prettier/prettier */
import { Controller, Get,  Body, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { User } from 'src/company/decorators/user.decorator';
import type { Payload } from 'utils/interfaces';
import { JwtGuard } from 'src/user/gurards/jwt.guard';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('team-member')
@UseGuards(JwtGuard)
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}


  @Get(":teamId")
  @ApiOperation({summary:"get all team members in the specific team"})
  @ApiParam({type:String,name:"teamId",description:"id of team "})

  findAll(
    @Param("teamId",new ParseUUIDPipe()) teamId:string
  ) {
    return this.teamMemberService.findAll(teamId);
  }



  @Delete(':id')
  @ApiOperation({summary:" delete team member by owner"})
  @ApiParam({type:String,name:"id",description:"id of team member"})
  @ApiBody({
    
    schema:{
      example:{
        teamId:"string",
        
      },


    }
  })
  remove(
    @Param('id') id: string,
    @Body("teamId") teamId:string,
    @User() user:Payload
  ) {
    return this.teamMemberService.remove(id,teamId,user.id);
  }
}
