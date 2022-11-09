import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  providers: [AnswerService],
  controllers: [AnswerController],
})
export class AnswerModule {}
