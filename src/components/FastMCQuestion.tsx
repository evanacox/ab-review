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

  public componentWillUnmount(): void {
    forceCloseWithoutAnimation(this.modalRef);
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
        <dialog ref={this.modalRef}>
          <article>
            <header>Incorrect!</header>
            <section>
              <p>The correct answer is: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
              <br />
              <Node>{"\\frac{-b\\pm\\sqrt{b^2 - 4ac}}{2a}"}</Node>
            </section>
            <footer>
              <button onClick={() => this.onModalClick()}>Next</button>
            </footer>
          </article>
        </dialog>
      </div>
    );
  }

  public resetIndex(): void {
    super.setState((state, _) => ({ selectedIndex: null }));
  }

  private onModalClick(): void {
    closeModal(this.modalRef);

    this.props.onNext(this.state.handler, this.state.selectedIndex!);
  }

  private onClick(index: number): void {
    if (this.state.handler.isCorrect(index)) {
      this.props.onNext(this.state.handler, index);
    } else {
      openModal(this.modalRef);
    }

    super.setState((state, _) => ({ handler: state.handler, selectedIndex: index }));
  }
}

export default FastMCQuestion;
