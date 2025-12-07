import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { IQuestionsService } from './question.service.interface';

@Injectable()
export class QuestionsService implements IQuestionsService {
  constructor(private prisma: PrismaService) {}
}
