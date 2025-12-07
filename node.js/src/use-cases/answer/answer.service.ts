import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { IAnswerService } from './answer.service.interface';

@Injectable()
export class AnswerService implements IAnswerService {
  constructor(private prisma: PrismaService) {}
}
