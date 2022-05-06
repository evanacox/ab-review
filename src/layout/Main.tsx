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
import { Provider, Node } from "@nteract/mathjax";
import NormalMCQSet from "../layout/NormalMCQSet";
import FastMCQuestion from "../components/FastMCQuestion";
import { indexToLetter } from "../util/strings";
import "./Main.css";
import FastMCQSet from "./FastMCQSet";

interface MainState {
  questionIndex: number;
  needChange: boolean;
}

const questions = [
  {
    prompt: (
      <div>
        Find <Node inline>{"f'(x)"}</Node> in simplest form.
        <Node>{`f(x) = 2x^5 + \\frac{1}{\\sqrt{5e^6x}}`}</Node>
      </div>
    ),
    incorrectAnswers: [
      <Node inline>x^2 + y^2 = z^2</Node>,
      <Node inline>{"\\int_0^1\\frac{sin(x)}{x}dx"}</Node>,
      <Node inline>{"\\ln(x^2) + C"}</Node>,
      <Node inline>{"42"}</Node>,
    ],
    correctAnswer: <Node inline>{"\\frac{-b\\pm\\sqrt{b^2 - 4ac}}{2a}"}</Node>,
  },
  {
    prompt: (
      <div>
        Find <Node inline>{"\\int f'(x)dx"}</Node> in simplest form.
        <Node>{`f(x) = 2x^5 + \\frac{1}{\\sqrt{5e^6x}}`}</Node>
      </div>
    ),
    incorrectAnswers: [
      <Node inline>{"f'(x) + C"}</Node>,
      <Node inline>{"10x^4 - \\frac{3e^(-3x)}{\\sqrt{5}} + C"}</Node>,
      <Node inline>{"6 + C"}</Node>,
      <Node inline>{"idk lmao"}</Node>,
    ],
    correctAnswer: <Node inline>{"2x^5 + \\frac{1}{\\sqrt{5e^6x}} + C"}</Node>,
  },
  {
    prompt: (
      <div>
        Find <Node inline>{"\\sqrt{4}"}</Node> in simplest form.
        <br />
        <br />
      </div>
    ),
    incorrectAnswers: [
      <Node inline>2</Node>,
      <Node inline>{"\\pm2"}</Node>,
      <Node inline>{"16"}</Node>,
      <Node inline>{"64"}</Node>,
    ],
    correctAnswer: <Node inline>{"e^{e^{x}}"}</Node>,
  },
];

export class Main extends React.Component<{}, MainState> {
  public constructor(props: any) {
    super(props);

    this.state = { questionIndex: 0, needChange: false };
  }

  public render(): JSX.Element {
    return (
      <main className="container">
        <Provider>
          <article>
            <h2>Review: AB</h2>
            <NormalMCQSet questions={questions} onFinish={(info) => console.log("done! got info: ", info)} />
          </article>
          <article>
            <h2>Review: AB But Different</h2>
            <FastMCQSet questions={questions} onFinish={(info) => console.log("done! got info: ", info)} />
          </article>
        </Provider>
      </main>
    );
  }
}

export default Main;
