import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateQuestionDto, EditQuestionDto } from './dto';
import { QuestionService } from './question.service';


@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get()
  getQuestions() {
    return this.questionService.getQuestions();
  }

  @Get(':question_id')
  getQuestionById(@Param('question_id', ParseIntPipe) questionId: number) {
    return this.questionService.getQuestionById(questionId);
  }

  @Get('user/:user_id')
  getQuestionsByUser(@Param('user_id', ParseIntPipe) userId: number) {
    return this.questionService.getQuestionsByUser(userId);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  createQuestions(
    @GetUser('user_id') userId: number,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionService.createQuestions(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':question_id')
  editQuestionById(
    @GetUser('user_id') userId: number,
    @Param('question_id', ParseIntPipe) questionId: number,
    @Body() dto: EditQuestionDto,
  ) {
    return this.questionService.editQuestionById(userId, questionId, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':question_id')
  deleteQuestionById(
    @GetUser('user_id') userId: number,
    @Param('question_id', ParseIntPipe) questionId: number,
  ) {
    return this.questionService.deleteQuestionById(userId, questionId);
  }
}
