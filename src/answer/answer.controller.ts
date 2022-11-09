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
import { CreateAnswerDto, EditAnswerDto } from './dto';
import { AnswerService } from './answer.service';

@Controller('answers')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get('question/:question_id')
  getAnswersByQuestion(@Param('question_id', ParseIntPipe) questionId: number) {
    return this.answerService.getAnswersByQuestion(questionId);
  }

  @Get('user/:user_id')
  getAnswersByUser(@Param('user_id', ParseIntPipe) userId: number) {
    return this.answerService.getAnswersByUser(userId);
  }

  @Get(':answer_id')
  getAnswerById(@Param('answer_id', ParseIntPipe) answerId: number) {
    return this.answerService.getAnswerById(answerId);
  }

  @UseGuards(JwtGuard)
  @Patch('upvote/:answer_id')
  upvoteAnswer(
    @GetUser('user_id') userId: number,
    @Param('answer_id', ParseIntPipe) answerId: number,
  ) {
    return this.answerService.upvoteAnswer(userId, answerId);
  }

  @UseGuards(JwtGuard)
  @Patch('downvote/:answer_id')
  downvoteAnswer(
    @GetUser('user_id') userId: number,
    @Param('answer_id', ParseIntPipe) answerId: number,
  ) {
    return this.answerService.downvoteAnswer(userId, answerId);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  createAnswers(
    @GetUser('user_id') userId: number,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.answerService.createAnswers(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':answer_id')
  editAnswerById(
    @GetUser('user_id') userId: number,
    @Param('answer_id', ParseIntPipe) answerId: number,
    @Body() dto: EditAnswerDto,
  ) {
    return this.answerService.editAnswerById(userId, answerId, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':answer_id')
  deleteAnswerById(
    @GetUser('user_id') userId: number,
    @Param('answer_id', ParseIntPipe) answerId: number,
  ) {
    return this.answerService.deleteAnswerById(userId, answerId);
  }
}
