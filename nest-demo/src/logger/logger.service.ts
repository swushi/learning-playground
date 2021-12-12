import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerService {
  logRequest(msg: any, context?: string, req?: Request) {
    Logger.log(msg, `${context} - ${req.method} ${req.url}`);
  }
}
