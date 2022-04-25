//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import React from "react";
import { Node } from "@nteract/mathjax";
import { shuffleInPlace } from "../util/array";

export interface Question {
  prompt: JSX.Element;
  answers: (JSX.Element | string)[];
  correctAnswer: number;
}

export interface MultipleChoiceProps {
  question: Question;
}

interface MultipleChoiceState {
  selected: number;
}

export class MultipleChoiceQuestion extends React.Component<MultipleChoiceProps, {}> {
  public constructor(props: MultipleChoiceProps) {
    super(props);
    this.state = { selected: -1 };

    shuffleInPlace(this.props.question.answers);
  }

  private static alphabet = "abcdefghijklmnopqrstuvwxyz";

  public render(): JSX.Element {
    const children = [];

    for (const [index, answer] of this.props.question.answers.entries()) {
      children.push(
        <label htmlFor={MultipleChoiceQuestion.alphabet[index]} key={MultipleChoiceQuestion.alphabet[index]}>
          <input type="radio" id="small" name="mcqInput" value={MultipleChoiceQuestion.alphabet[index]} />
          {MultipleChoiceQuestion.alphabet[index]})&nbsp;&nbsp;
          {answer}
        </label>
      );
    }

    return (
      <div>
        {this.props.question.prompt}
        <fieldset>{children}</fieldset>
      </div>
    );
  }
}
