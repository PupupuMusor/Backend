import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const message =
      typeof errorResponse === 'object'
        ? (errorResponse as any).message
        : exception.message;

    let errors;
    if (
      typeof errorResponse === 'object' &&
      (errorResponse as any).errors?.length
    ) {
      errors = {
        mes: (errorResponse as any).errors.map((e: any) => Object.values(e)),
        row: (errorResponse as any).row,
      };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors && { errors }),
    });
  }
}
