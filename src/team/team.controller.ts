/* eslint-disable prettier/prettier */
import { Controller, Post, Body,  Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/company/decorators/user.decorator';
import * as interfaces from 'utils/interfaces';
import { JwtGuard } from 'src/user/gurards/jwt.guard';
import { InviteDto } from './dto/Invite.dto';

@Controller('team')
@UseGuards(JwtGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  public async create(@Body() createTeamDto: CreateTeamDto,@User() user:interfaces.Payload) {
    const newTeam = await this.teamService.create(createTeamDto,user.id);
    return newTeam

  }

  @Post("invite/:teamId")
  public async sendInvitation(
    @Param("teamId",new ParseUUIDPipe()) teamId:string,
    @Body()  inviteDto:InviteDto,
    
  ) {
    const result = await this.teamService.inviteMember(inviteDto.email,teamId);
    return result

  }

}
