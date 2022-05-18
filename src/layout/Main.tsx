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
import EquationInputQuestion, {
  equationQuestionFromDerivative,
  equationQuestionFromIntegral,
} from "../components/EquationInputQuestion";
import { MultipleChoiceSet } from "../components/MultipleChoiceQuestion";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Page } from "./Nav";
import {
  differentiableTrigFunction,
  elementaryIntegrableFunction,
  empty,
  Equation,
  integrableTrigFunction,
  inverseTrigFunction,
  monomial,
  sumDiffOfLength,
} from "../functions/equations";
import { IntegralProblem, randomIntegral, uSubstitution } from "../functions/integration";
import "./Main.css";
import { MockExam } from "./MockExam";
import { runPython, runPythonAsync } from "../util/python";
import { DerivativeProblem, randomDerivative } from "../functions/differentiation";

interface MainProps {
  set: MultipleChoiceSet | null;
  page: Page;
}

interface MainState {
  currentIntegralProblem: IntegralProblem;
  currentDerivativeProblem: DerivativeProblem;
  currentEquations: Equation[];
}

export class Main extends React.Component<MainProps, MainState> {
  public constructor(props: MainProps) {
    super(props);

    this.state = {
      currentEquations: [empty()],
      currentIntegralProblem: randomIntegral(),
      currentDerivativeProblem: randomDerivative(),
    };
  }

  public render(): JSX.Element {
    return (
      <main className="container">
        <SwitchTransition>
          <CSSTransition key={this.props.page} timeout={150} classNames={"main-fade"}>
            {this.renderPage()}
          </CSSTransition>
        </SwitchTransition>
      </main>
    );
  }

  private renderPage(): JSX.Element {
    const questions = this.props.set === null ? [] : this.props.set.questions;

    switch (this.props.page) {
      case Page.Home: {
        const nodes = this.state.currentEquations.map((eq) => <Node>{eq.displayLatex()}</Node>);

        return (
          <article>
            <h2>Review: AB</h2>
            <div className={"container-fluid"}>
              <article>
                <h2>Problems</h2>
                {nodes}
              </article>
            </div>
            <button
              onClick={async () => {
                console.log(runPython("sympy.latex(sympy.diff('sin(x)', 'x'))"));
              }}
            >
              Next
            </button>
          </article>
        );
      }
      case Page.Integration: {
        return (
          <article>
            <h2>Mixed Integration Practice</h2>
            <EquationInputQuestion
              question={equationQuestionFromIntegral(this.state.currentIntegralProblem)}
              onSubmit={() => this.setState((_1, _2) => ({ currentIntegralProblem: randomIntegral() }))}
            />
          </article>
        );
      }
      case Page.Differentiation: {
        return (
          <article>
            <h2>Mixed Differentiation Practice</h2>
            <EquationInputQuestion
              question={equationQuestionFromDerivative(this.state.currentDerivativeProblem)}
              onSubmit={() => this.setState((_1, _2) => ({ currentDerivativeProblem: randomDerivative() }))}
            />
          </article>
        );
      }
      case Page.MockExam: {
        if (this.props.set === null) {
          return (
            <article>
              <h2>Mock Exam</h2>
              <p>You need to load a question set first! See the button on the top of the screen.</p>
            </article>
          );
        }

        return <MockExam set={this.props.set} />;
      }
    }
  }
}

export default Main;
