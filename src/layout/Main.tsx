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
import FastMCQSet from "./FastMCQSet";
import "./Main.css";
import { MultipleChoiceSet } from "../components/MultipleChoiceQuestion";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Page } from "./Nav";

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

interface MainProps {
  set: MultipleChoiceSet | null;
  page: Page;
}

export class Main extends React.Component<MainProps, {}> {
  public constructor(props: MainProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <main className="container">
        <Provider>
          <SwitchTransition>
            <CSSTransition key={this.props.page} timeout={150} classNames={"main-fade"}>
              {this.renderPage()}
            </CSSTransition>
          </SwitchTransition>
        </Provider>
      </main>
    );
  }

  private renderPage(): JSX.Element {
    const questions = this.props.set === null ? [] : this.props.set.questions;

    switch (this.props.page) {
      case Page.Home: {
        return (
          <article>
            <h2>Review: AB</h2>
            <button>Mixed Practice</button>
          </article>
        );
      }
      case Page.Integration: {
        return (
          <article>
            <h2>Mixed Integration Practice</h2>

            <FastMCQSet questions={questions} onFinish={(info) => console.log("done! got info: ", info)} />
          </article>
        );
      }
      case Page.Differentiation: {
        return (
          <article>
            <h2>Mixed Differentiation Practice</h2>
            <FastMCQSet questions={questions} onFinish={(info) => console.log("done! got info: ", info)} />
          </article>
        );
      }
      case Page.MockExam: {
        return (
          <article>
            <h2>Mock Exam</h2>
            <NormalMCQSet questions={questions} onFinish={(info) => console.log("done! got info: ", info)} />
          </article>
        );
      }
    }
  }
}

export default Main;
