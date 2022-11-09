import { IsOptional, IsString } from 'class-validator';

export class EditQuestionDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  question_attachment_url?: string;
}
