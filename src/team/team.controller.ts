/* eslint-disable prettier/prettier */
import { Controller, Post, Body,  Param, UseGuards, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from '../company/decorators/user.decorator';
import * as interfaces from '../../utils/interfaces';
import { JwtGuard } from '../user/gurards/jwt.guard';
import { InviteDto } from './dto/Invite.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiSecurity } from '@nestjs/swagger';

@Controller('team')
@UseGuards(JwtGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({type:CreateTeamDto})
  @ApiOperation({summary:"create new team"})
  public async create(@Body() createTeamDto: CreateTeamDto,@User() user:interfaces.Payload) {
    const newTeam = await this.teamService.create(createTeamDto,user.id);
    return {newTeam}

  }

  @Post("invite/:teamId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiParam({name:"teamId",type:String,required:true})
  @ApiOperation({summary:" invite user to join to team"})
  public async sendInvitation(
    @Param("teamId",new ParseUUIDPipe()) teamId:string,
    @Body()  inviteDto:InviteDto,
    
  ) {
    const result = await this.teamService.inviteMember(inviteDto.email,teamId);
    return result

  }

}
