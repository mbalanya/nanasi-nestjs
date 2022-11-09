import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto, EditQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  getQuestions() {
    return this.prisma.question.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getQuestionById(questionId: number) {
    await this.prisma.question.update({
      data: {
        views: {
          increment: 1,
        },
      },
      where: {
        question_id: questionId,
      },
    });

    return this.prisma.question.findUnique({
      where: {
        question_id: questionId,
      },
    });
  }

  getQuestionsByUser(userId: number) {
    return this.prisma.question.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async createQuestions(userId: number, dto: CreateQuestionDto) {
    const createQuestion = await this.prisma.question.create({
      data: {
        userId,
        views: 0,
        question: dto.question,
        question_attachment_url: dto.question_attachment_url,
      },
    });
    return createQuestion;
  }

  async editQuestionById(
    userId: number,
    questionId: number,
    dto: EditQuestionDto,
  ) {
    const question = await this.prisma.question.findUnique({
      where: {
        question_id: questionId,
      },
    });

    if (!question || question.userId !== userId)
      throw new ForbiddenException('Access to Question Denied!');

    return this.prisma.question.update({
      where: {
        question_id: questionId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteQuestionById(userId: number, questionId: number) {
    const question = await this.prisma.question.findUnique({
      where: {
        question_id: questionId,
      },
    });

    if (!question || question.userId !== userId)
      throw new ForbiddenException('Access to Question Denied!');

    await this.prisma.question.delete({
      where: {
        question_id: questionId,
      },
    });
  }
}
