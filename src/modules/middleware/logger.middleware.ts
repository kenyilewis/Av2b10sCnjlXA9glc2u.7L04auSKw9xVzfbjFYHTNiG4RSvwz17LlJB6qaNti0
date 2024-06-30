import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private morganLogger = morgan('combined');

  use(req: Request, res: Response, next: NextFunction): void {
    this.morganLogger(req, res, (err) => {
      if (err) return next(err);
      const startTime = Date.now();
      const { method, originalUrl } = req;

      res.on('finish', () => {
        const { statusCode, statusMessage } = res;
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${
            Date.now() - startTime
          }ms - ${statusMessage}`,
        );
      });

      next();
    });
  }
}
