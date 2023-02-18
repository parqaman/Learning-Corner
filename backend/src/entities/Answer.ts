import { object, string } from 'yup';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Question } from './Question';

@Entity()
export class Answer extends BaseEntity {
  @Property()
  text: string;

  @ManyToOne(() => Question)
  question: Question;

  constructor({ text, question }: CreateAnswerDTO) {
    super();
    this.text = text;
    this.question = question;
  }
}

export const CreateAnswerSchema = object({
  text: string().required(),
});

export type CreateAnswerDTO = {
  text: string;
  question: Question;
};
