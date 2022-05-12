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
import { EditableMathField, MathField } from "react-mathquill";
import { replaceIfNotSubstring } from "../util/strings";

export interface EquationInputProps {}

interface EquationState {
  input: string;
}

type ShortcutData = [string, string, string, ((mathField: MathField) => void) | null];

export class EquationInput extends React.Component<EquationInputProps, {}> {
  public state: EquationState;

  public constructor(props: EquationInputProps) {
    super(props);
    this.state = { input: "" };
  }

  public render(): JSX.Element {
    return (
      <div className={"container"}>
        <EditableMathField latex={this.state.input} onChange={(field) => this.updateFromLatex(field)} />
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

    for (const [needle, needleFull, replaceWith, updater] of EquationInput.shortcuts) {
      const replaced = replaceIfNotSubstring(latex, needle, needleFull, replaceWith);

      if (replaced !== latex) {
        mathField.latex(replaced);

        if (updater !== null) {
          updater(mathField);
        }
      }
    }

    super.setState((state, props) => {
      return { input: mathField.latex() };
    });
  }
}

export default EquationInput;
