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
import Nerdamer from "nerdamer";
import * as Algebrite from "algebrite";
import EquationInput from "./EquationInput";
import { IntegralProblem } from "../functions/integration";
import { Node } from "@nteract/mathjax";
import { Equation } from "../functions/equations";
import { closeModal, openModal } from "../util/modal";
import { EditableMathField, MathField } from "react-mathquill";
import { replaceIfNotSubstring } from "../util/strings";
import { DerivativeProblem } from "../functions/differentiation";
import { runPython } from "../util/python";

export interface EquationQuestion {
  correct: Equation;
  prompt: JSX.Element;
}

export function equationQuestionFromIntegral(problem: IntegralProblem): EquationQuestion {
  return {
    correct: problem.correct,
    prompt: <Node>{"\\int{" + problem.integrand.asLatex() + "}dx ="}</Node>,
  };
}

export function equationQuestionFromDerivative(problem: DerivativeProblem): EquationQuestion {
  return {
    correct: problem.correct,
    prompt: <Node>{"\\frac{d}{dx}[" + problem.original.asLatex() + "] ="}</Node>,
  };
}

export interface EquationQuestionProps {
  question: EquationQuestion;
  onSubmit: (correct: boolean) => void;
}

interface State {
  equationLatex: string;
  incorrectMessage: JSX.Element;
}

type ShortcutData = [string, string, string, ((mathField: MathField) => void) | null];

export class EquationInputQuestion extends React.Component<EquationQuestionProps, State> {
  private readonly modalRef: React.RefObject<HTMLElement>;

  public constructor(props: EquationQuestionProps) {
    super(props);

    this.modalRef = React.createRef();
    this.state = {
      equationLatex: "",
      incorrectMessage: <div></div>,
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.props.question.prompt}
        {this.mathInput()}
        <button key={"submit"} onClick={(_) => this.onClick()}>
          Submit
        </button>
        <dialog ref={this.modalRef}>
          <article>
            <header>Incorrect!</header>
            <p>The correct answer is:</p>
            <Node>{this.props.question.correct.displayLatex()}</Node>
            <br />
            {this.state.incorrectMessage}
            <footer>
              <a
                href="#"
                role="button"
                onClick={() => {
                  closeModal(this.modalRef);
                  this.submit(false);
                }}
              >
                Next
              </a>
            </footer>
          </article>
        </dialog>
      </div>
    );
  }
  private mathInput(): JSX.Element {
    return (
      <div className={"container"}>
        <div
          style={{
            marginTop: "10px",
            marginBottom: "20px",
            marginLeft: "30%",
            marginRight: "30%",
            width: "100%",
            height: "100%",
          }}
        >
          <EditableMathField
            style={{ width: "40%" }}
            latex={this.state.equationLatex}
            onChange={(field) => this.updateFromLatex(field)}
          />
        </div>
      </div>
    );
  }

  private static shortcuts: ShortcutData[] = [
    [
      "int",
      "\\int_",
      "\\int_{ }^{ }",
      (mathField: MathField) => {
        mathField.keystroke("Left");
        mathField.keystroke("Left");
      },
    ],
    ["iint", "\\int", "\\int", null],
    [
      "sqrt",
      "\\sqrt",
      "\\sqrt{ }",
      (mathField: MathField) => {
        mathField.keystroke("Left");
      },
    ],
    ["pi", "\\pi", "\\pi", null],
  ];

  public updateFromLatex(mathField: MathField) {
    const latex = mathField.latex();

    for (const [needle, needleFull, replaceWith, updater] of EquationInputQuestion.shortcuts) {
      const replaced = replaceIfNotSubstring(latex, needle, needleFull, replaceWith);

      if (replaced !== latex) {
        mathField.latex(replaced);

        if (updater !== null) {
          updater(mathField);
        }
      }
    }

    super.setState((state, props) => {
      return { equationLatex: mathField.latex() };
    });
  }

  private onClick(): void {
    try {
      const textual = Nerdamer.convertFromLaTeX(this.state.equationLatex).text("fractions");
      console.log(textual);
      const result = runPython(`sympy.simplify('${this.props.question.correct.asTextual()} - ${textual}')`);

      console.log(result);

      if (result !== "0") {
        openModal(this.modalRef);
      } else {
        this.submit(true);
      }
    } catch (e) {
      openModal(this.modalRef);
    }
  }

  private submit(correct: boolean): void {
    this.setState((state, props) => ({ equationLatex: "" }));
    this.props.onSubmit(true);
  }
}

export default EquationInputQuestion;
