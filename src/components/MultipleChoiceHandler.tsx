//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { shuffleInPlace } from "../util/array";
import { MultipleChoiceQuestion, SingleAnswer } from "./MultipleChoiceQuestion";

interface MultipleChoiceState {
  question: MultipleChoiceQuestion;
  answers: JSX.Element[];
  answersObject: SingleAnswer[];
  correctIndex: number;
}

export class MultipleChoiceHandler {
  private state: MultipleChoiceState;

  public constructor(question: MultipleChoiceQuestion) {
    this.state = this.updateQuestionInternal(question);
  }

  public answers(): JSX.Element[] {
    return this.state.answers;
  }

  public correctIndex(): number {
    return this.state.correctIndex;
  }

  public correctAnswer(): JSX.Element {
    return this.state.answers[this.correctIndex()];
  }

  public isCorrect(index: number): boolean {
    if (index === -1) {
      return false;
    }

    return index === this.correctIndex();
  }

  public updateQuestion(question: MultipleChoiceQuestion) {
    if (this.state.question !== question) {
      this.state = this.updateQuestionInternal(question);
    }
  }

  public singleAnswerOfIndex(index: number): SingleAnswer {
    return this.state.answersObject[index];
  }

  private updateQuestionInternal(question: MultipleChoiceQuestion): MultipleChoiceState {
    // tag each answer with an ID, so we can both know which one is selected,
    // and so we can know which one is correct. the correct answer is always
    // the one with the largest tag
    const state: MultipleChoiceState = {
      question: question,
      answersObject: [...question.incorrect, question.correct],
      answers: [],
      correctIndex: -1,
    };

    shuffleInPlace(state.answersObject);
    state.answers = state.answersObject.map((answer) => answer.asInlineAnswer());
    state.correctIndex = state.answersObject.findIndex((elem) => elem === question.correct);

    return state;
  }
}

export default MultipleChoiceHandler;
