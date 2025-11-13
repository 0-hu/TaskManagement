import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  getDashboardStats(@Query('userId') userId?: string) {
    return this.statsService.getDashboardStats(userId);
  }

  @Get('tasks')
  getTaskStats() {
    return this.statsService.getTaskStats();
  }

  @Get('submissions')
  getSubmissionStats() {
    return this.statsService.getSubmissionStats();
  }

  @Get('users/:userId')
  getUserStats(@Param('userId') userId: string) {
    return this.statsService.getUserStats(userId);
  }

  @Get('departments/:departmentId')
  getDepartmentStats(@Param('departmentId') departmentId: string) {
    return this.statsService.getDepartmentStats(departmentId);
  }

  @Get('monthly-trend')
  getMonthlyTrend() {
    return this.statsService.getMonthlyTrend();
  }

  @Get('department-comparison')
  getDepartmentComparison() {
    return this.statsService.getDepartmentComparison();
  }
}
