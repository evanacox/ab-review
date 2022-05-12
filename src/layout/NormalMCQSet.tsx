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
import NormalMCQuestion from "../components/NormalMCQuestion";
import "./NormalMCQSet.css";
import MultipleChoiceHandler from "../components/MultipleChoiceHandler";

export class NormalMCQSet extends React.Component<MCQSetProps, MCQSetState> {
  public constructor(props: MCQSetProps) {
    super(props);

    this.state = { questionIndex: 0, info: { answers: new Map<number, boolean>() }, needChange: false };
  }

  public render(): JSX.Element {
    const inner =
      this.props.questions.length > 0 ? (
        <NormalMCQuestion
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
    // this fires twice during the switch, the first time we update `needChange` back
    // to the default value (since this is when the first question starts getting removed).
    //
    // when we go back in a second time, needChange will be false, so we know to actually update
    // the question that time
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
    super.setState((state, _) => {
      state.info.answers.set(state.questionIndex, handler.isCorrect(selectedIndex));

      return {
        info: state.info,
        needChange: true,
      };
    });
  }
}

export default NormalMCQSet;
