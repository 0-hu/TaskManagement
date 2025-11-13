import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { RejectSubmissionDto } from './dto/reject-submission.dto';
import { QuerySubmissionDto } from './dto/query-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request.interface';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.submissionsService.create(createSubmissionDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QuerySubmissionDto) {
    return this.submissionsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveSubmissionDto,
  ) {
    return this.submissionsService.approve(id, approveDto);
  }

  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectDto: RejectSubmissionDto,
  ) {
    return this.submissionsService.reject(id, rejectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}
