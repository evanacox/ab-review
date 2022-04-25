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
import EquationInput from "../components/EquationInput";
import { Provider, Node } from "@nteract/mathjax";
import { MultipleChoiceQuestion } from "../components/MultipleChoiceQuestion";

export class Main extends React.Component<{}, {}> {
  public constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const question = {
      prompt: (
        <div>
          Find <Node inline>f'(x)</Node> in simplest form.
          <Node>{`f(x) = 2x^5 + \\frac{1}{\\sqrt{5e^6x}}`}</Node>
        </div>
      ),
      answers: [
        <Node inline>x^2 + y^2 = z^2</Node>,
        <Node inline>{"\\frac{-b\\pm\\sqrt{b^2 - 4ac}}{2a}"}</Node>,
        <Node inline>{"\\int_0^1\\frac{sin(x)}{x}dx"}</Node>,
        <Node inline>{"ln(x^2) + C"}</Node>,
        <Node inline>{"42"}</Node>,
      ],
      correctAnswer: 0,
    };

    return (
      <main className="container">
        <Provider>
          <article>
            <h2>Review: AB</h2>
            <MultipleChoiceQuestion question={question} />
          </article>
        </Provider>
      </main>
    );
  }
}

export default Main;
