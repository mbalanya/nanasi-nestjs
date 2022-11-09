import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto, EditAnswerDto } from './dto';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  getAnswersByQuestion(questionId: number) {
    return this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  getAnswersByUser(userId: number) {
    return this.prisma.answer.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  getAnswerById(answerId: number) {
    return this.prisma.answer.findUnique({
      where: {
        answer_id: answerId,
      },
    });
  }

  async upvoteAnswer(userId: number, answerId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Login to upvote!');

    const upvote = await this.prisma.answer.update({
      data: {
        upvotes: {
          increment: 1,
        },
      },
      where: {
        answer_id: answerId,
      },
    });
    return upvote;
  }

  async downvoteAnswer(userId: number, answerId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Login to downvote!');

    const downvote = await this.prisma.answer.update({
      data: {
        downvotes: {
          increment: 1,
        },
      },
      where: {
        answer_id: answerId,
      },
    });
    return downvote;
  }

  async createAnswers(userId: number, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: {
        question_id: dto.questionId,
      },
    });

    if (!question) throw new ForbiddenException('Question does not exist!');

    const createAnswer = await this.prisma.answer.create({
      data: {
        userId,
        questionId: dto.questionId,
        is_best_answer: false,
        upvotes: 0,
        downvotes: 0,
        answer: dto.answer,
        answer_attachment_url: dto.answer_attachment_url,
      },
    });
    return createAnswer;
  }

  async editAnswerById(userId: number, answerId: number, dto: EditAnswerDto) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        answer_id: answerId,
      },
    });

    if (!answer)
      throw new ForbiddenException('Access to Answer Question Denied!');

    return this.prisma.answer.update({
      where: {
        answer_id: answerId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteAnswerById(userId: number, answerId: number) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        answer_id: answerId,
      },
    });

    if (!answer)
      throw new ForbiddenException('Access to Delete Answer Denied!');

    await this.prisma.answer.delete({
      where: {
        answer_id: answerId,
      },
    });
  }
}
