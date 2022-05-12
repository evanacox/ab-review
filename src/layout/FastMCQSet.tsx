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
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { MCQSetProps, MCQSetState } from "./MCQSet";
import MultipleChoiceHandler from "../components/MultipleChoiceHandler";
import FastMCQuestion from "../components/FastMCQuestion";
import "./FastMCQSet.css";
import NormalMCQuestion from "../components/NormalMCQuestion";

export class FastMCQSet extends React.Component<MCQSetProps, MCQSetState> {
  private readonly questionRef: React.RefObject<FastMCQuestion>;

  public constructor(props: MCQSetProps) {
    super(props);

    this.questionRef = React.createRef();
    this.state = { questionIndex: 0, info: { answers: new Map<number, boolean>() }, needChange: false };
  }

  public render(): JSX.Element {
    const inner =
      this.props.questions.length > 0 ? (
        <FastMCQuestion
          ref={this.questionRef}
          question={this.props.questions[this.state.questionIndex]}
          onNext={(handler, index) => this.onNext(handler, index)}
        />
      ) : (
        <div></div>
      );

    return (
      <div>
        <SwitchTransition>
          <CSSTransition
            key={this.state.needChange + ""}
            timeout={150}
            classNames={"normal-fade"}
            addEndListener={() => this.onTransitionChange()}
          >
            {inner}
          </CSSTransition>
        </SwitchTransition>
      </div>
    );
  }

  private onTransitionChange(): void {
    if (this.state.needChange) {
      return super.setState((_1, _2) => ({ needChange: false }));
    }

    if (this.state.questionIndex + 1 === this.props.questions.length) {
      this.props.onFinish(this.state.info);
      super.setState((state, props) => ({ info: { answers: new Map<number, boolean>() } }));
    }

    return super.setState((state, props) => ({
      questionIndex: (state.questionIndex + 1) % props.questions.length,
    }));
  }

  private onNext(handler: MultipleChoiceHandler, selectedIndex: number): void {
    setTimeout(() => {
      // we need to properly clear out the selected index, so we don't carry it over
      // between the different questions. We can do this whenever we start the rest of the
      // transition between states, just to make it look nice
      this.questionRef.current!.resetIndex();
      super.setState((state, _) => ({ needChange: true }));
    }, 500);

    super.setState((state, _) => {
      state.info.answers.set(state.questionIndex, handler.isCorrect(selectedIndex));

      return {
        info: state.info,
      };
    });
  }
}

export default FastMCQSet;
