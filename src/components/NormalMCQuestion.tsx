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
import { MultipleChoiceHandler } from "./MultipleChoiceHandler";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { indexToCapitalLetter, indexToLetter } from "../util/strings";
import "./NormalMCQuestion.css";

export interface NormalMCProps {
  question: MultipleChoiceQuestion;
  onNext: (question: MultipleChoiceHandler, selected: number) => void;
}

interface NormalMCState {
  handler: MultipleChoiceHandler;
  selectedIndex: number;
  selectedButton: HTMLInputElement | null;
}

export class NormalMCQuestion extends React.Component<NormalMCProps, NormalMCState> {
  public constructor(props: NormalMCProps) {
    super(props);

    this.state = {
      handler: new MultipleChoiceHandler(this.props.question),
      selectedIndex: -1,
      selectedButton: null,
    };
  }

  public render(): JSX.Element {
    this.state.handler.updateQuestion(this.props.question);

    const answers = this.state.handler.answers().map((answer, i) => {
      const letter = indexToLetter(i);

      return (
        <label key={letter}>
          <input type="radio" name="mcq-input" value={i} onChange={(e) => this.onRadioSelect(e)} />
          {indexToCapitalLetter(i)})&nbsp;&nbsp;
          {answer}
        </label>
      );
    });

    return (
      <div>
        {this.props.question.prompt}
        <br />
        <fieldset>
          <div className={"mcq-container"}>{answers}</div>
        </fieldset>
        <button onClick={(e) => this.onNextClick(e)}>Next</button>
      </div>
    );
  }

  private onRadioSelect(event: React.ChangeEvent<HTMLInputElement>): void {
    super.setState((state, props) => ({
      handler: state.handler,
      selectedIndex: parseInt(event.target.value),
      selectedButton: event.target,
    }));
  }

  private onNextClick(event: React.MouseEvent<HTMLButtonElement>): void {
    this.props.onNext(this.state.handler, this.state.selectedIndex);

    super.setState((state, props) => {
      if (state.selectedButton !== null) {
        state.selectedButton.checked = false; // this is a direct DOM manipulation, hacky but works
      }

      return {
        selectedIndex: -1,
      };
    });
  }
}

export default NormalMCQuestion;
