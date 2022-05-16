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
import { closeModal, forceCloseWithoutAnimation, openModal } from "../util/modal";
import { Node } from "@nteract/mathjax";
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
  private readonly modalRef: React.RefObject<HTMLElement>;

  public constructor(props: FastMCProps) {
    super(props);

    this.modalRef = React.createRef();
    this.state = {
      handler: new MultipleChoiceHandler(this.props.question),
      selectedIndex: null,
    };
  }

  private mapIndexToClasses(index: number): string {
    if (
      this.state.selectedIndex === null ||
      (this.state.selectedIndex !== index && !this.state.handler.isCorrect(index))
    ) {
      return "secondary outline";
    }

    if (this.state.handler.isCorrect(index)) {
      return "correct";
    }

    return "incorrect";
  }

  public render(): JSX.Element {
    this.state.handler.updateQuestion(this.props.question);

    const answers = this.state.handler.answers().map((answer, i) => (
      <button className={this.mapIndexToClasses(i)} value={i} key={i} onClick={(_) => this.onClick(i)}>
        {answer}
      </button>
    ));

    return (
      <div>
        {this.props.question.prompt}
        <div className={"input-grid"}>{answers}</div>
      </div>
    );
  }

  public resetIndex(): void {
    super.setState((state, _) => ({ selectedIndex: null }));
  }

  private onClick(index: number): void {
    if (this.state.handler.isCorrect(index)) {
      this.props.onNext(this.state.handler, index);
    }

    super.setState((state, _) => ({ handler: state.handler, selectedIndex: index }));
  }
}

export default FastMCQuestion;
