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

export interface MultipleChoiceQuestion {
  prompt: JSX.Element;
  incorrectAnswers: JSX.Element[];
  correctAnswer: JSX.Element;
}

interface MultipleChoiceState {
  question: MultipleChoiceQuestion;
  answers: JSX.Element[];
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
    return this.state.correctIndex === index;
  }

  public updateQuestion(question: MultipleChoiceQuestion) {
    if (this.state.question !== question) {
      this.state = this.updateQuestionInternal(question);
    }
  }

  private updateQuestionInternal(question: MultipleChoiceQuestion): MultipleChoiceState {
    // tag each answer with an ID, so we can both know which one is selected,
    // and so we can know which one is correct. the correct answer is always
    // the one with the largest tag
    const state = {
      question: question,
      answers: question.incorrectAnswers.map((value) => value),
      correctIndex: -1,
    };

    state.answers.push(question.correctAnswer);

    shuffleInPlace(state.answers);

    state.correctIndex = state.answers.findIndex((elem) => elem === question.correctAnswer);

    return state;
  }
}

export default MultipleChoiceHandler;
