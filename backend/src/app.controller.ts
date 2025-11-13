import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health status' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Task Management API',
    };
  }
}
