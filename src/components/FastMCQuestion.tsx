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
import { MultipleChoiceHandler, MultipleChoiceQuestion } from "./MultipleChoiceHandler";
import "./FastMCQuestion.css";

export interface FastMCProps {
  question: MultipleChoiceQuestion;
  onNext: (question: MultipleChoiceHandler, selected: number) => void;
}

interface FastMCState {
  handler: MultipleChoiceHandler;
  selectedIndex: number | null;
}

export class FastMCQuestion extends React.Component<FastMCProps, FastMCState> {
  public constructor(props: FastMCProps) {
    super(props);

    this.state = {
      handler: new MultipleChoiceHandler(this.props.question),
      selectedIndex: null,
    };
  }

  private mapIndexToClasses(index: number): string {
    if (this.state.selectedIndex === null || this.state.selectedIndex !== index) {
      return "secondary outline";
    }

    if (this.state.selectedIndex === this.state.handler.correctIndex()) {
      return "correct";
    }

    return "incorrect";
  }

  public render(): JSX.Element {
    this.state.handler.updateQuestion(this.props.question);

    return (
      <div>
        {this.props.question.prompt}
        <div className={"input-grid"}>
          {this.state.handler.answers().map((answer, i) => (
            <button className={this.mapIndexToClasses(i)} value={i} key={i} onClick={(_) => this.onClick(i)}>
              {answer}
            </button>
          ))}
        </div>
      </div>
    );
  }

  private onClick(index: number) {
    this.props.onNext(this.state.handler, index);

    this.setState((state, _) => ({ handler: state.handler, selectedIndex: index }));
  }
}

export default FastMCQuestion;
