import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HealthCheckController {
  @Get('health-check')
  healthCheck(@Res() res: Response): Response {
    return res.status(200).json({
      message: 'Server is running',
      statusCode: 200
    });
  }
}
