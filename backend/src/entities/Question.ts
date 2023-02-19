import { object, string } from 'yup';
import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Answer } from './Answer';
import { Quiz } from './Quiz';

@Entity()
export class Question extends BaseEntity {
  @Property()
  text: string;

  @Property()
  correctAnswer: string;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @OneToMany(() => Answer, (e) => e.question)
  answers = new Collection<Answer>(this);

  constructor({ text, correctAnswer, quiz, answers }: CreateQuestionDTO) {
    super();
    this.text = text;
    this.correctAnswer = correctAnswer;
    this.quiz = quiz;
    this.answers = answers;
  }
}

export const CreateQuestionSchema = object({
  text: string().required(),
  correctAnswer: string().required(),
});

export type CreateQuestionDTO = {
  text: string;
  correctAnswer: string;
  quiz: Quiz;
  answers: Collection<Answer>;
};
