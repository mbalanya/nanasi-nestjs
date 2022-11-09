import { IsOptional, IsString } from 'class-validator';

export class EditAnswerDto {
  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  answer_attachment_url?: string;
}
