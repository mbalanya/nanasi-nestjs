import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsOptional()
  answer_attachment_url?: string;
}
