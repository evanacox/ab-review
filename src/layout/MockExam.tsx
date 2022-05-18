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
import "./MockExam.css";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { MultipleChoiceQuestion, MultipleChoiceSet, SingleAnswer } from "../components/MultipleChoiceQuestion";
import NormalMCQSet from "./NormalMCQSet";
import { shuffleCopy, shuffleInPlace } from "../util/array";
import { randomWithin } from "../util/random";
import { MCQSetCorrectIncorrectInfo } from "./MCQSet";

enum PageState {
  Start,
  Exam,
  ExploreQuestions,
  End,
}

export interface MockExamProps {
  set: MultipleChoiceSet;
}

interface MockExamState {
  page: PageState;
  picked: MultipleChoiceQuestion[];
  info: MCQSetCorrectIncorrectInfo | null;
}

function pickN(n: number, array: MultipleChoiceQuestion[], putInto: MultipleChoiceQuestion[]): number {
  for (let i = 0; i < n; ++i) {
    if (array.length === 0) {
      return n - i;
    }

    putInto.push(array.pop()!);
  }

  return 0;
}

function mapIndexToClasses(index: number, selected: number | null, correct: boolean): string {
  if (index !== selected && !correct) {
    return "secondary outline";
  }

  if (correct) {
    return "correct";
  }

  return "incorrect";
}

function questionBreakdown(question: MultipleChoiceQuestion, n: number, selected: SingleAnswer | null): JSX.Element {
  const array = shuffleCopy([...question.incorrect, question.correct]);
  const selectedIndex = selected === null ? null : array.indexOf(selected);
  const incorrect = array.map((answer, i) => (
    <button className={mapIndexToClasses(i, selectedIndex, answer === question.correct)} value={i} key={i}>
      {answer.asInlineAnswer()}{" "}
    </button>
  ));

  return (
    <div>
      {question.prompt}
      <br />
      <div className={"input-grid"}>{incorrect}</div>
    </div>
  );
}

export class MockExam extends React.Component<MockExamProps, MockExamState> {
  public constructor(props: MockExamProps) {
    super(props);

    this.state = { page: PageState.Start, picked: [], info: null };
  }

  public render(): JSX.Element {
    return (
      <SwitchTransition>
        <CSSTransition key={this.state.page} timeout={150} classNames={"mock-fade"}>
          {this.inner()}
        </CSSTransition>
      </SwitchTransition>
    );
  }

  // TODO: make this more robust. Randomize question breakdown?
  private static questionsPerUnit: number[] = [
    3, // unit #1
    3, // unit #2
    3, // unit #3
    4, // unit #4
    5, // unit #5
    6, // unit #6
    2, // unit #7
    4, // unit #8
  ];

  private pickQuestions(): MultipleChoiceQuestion[] {
    const questions = this.props.set!.questions;
    const output: MultipleChoiceQuestion[] = [];
    const sorted: MultipleChoiceQuestion[][] = [[], [], [], [], [], [], [], []];

    // sort questions into buckets by unit, sorted[unit - 1] = questions for that unit
    for (const question of questions) {
      sorted[question.unit - 1].push(question);
    }

    // randomize the arrays
    for (const array of sorted) {
      shuffleInPlace(array);
    }

    let orphanedQuestions = 0; // if a unit doesn't have enough questions, this is incremented
    for (const [unit, questionsForUnit] of MockExam.questionsPerUnit.entries()) {
      orphanedQuestions += pickN(questionsForUnit, sorted[unit], output);
    }

    if (questions.length < 30) {
      return output;
    }

    // fill up remaining with random questions for the ones we were missing
    for (let i = 0; i < orphanedQuestions; ++i) {
      while (true) {
        const index = randomWithin(0, sorted.length - 1);

        if (sorted[index].length !== 0) {
          output.push(sorted[index].pop()!);

          break;
        }
      }
    }

    shuffleInPlace(output);

    return output;
  }

  private inner(): JSX.Element {
    switch (this.state.page) {
      case PageState.Start:
        return (
          <article>
            <h2>Practice Test</h2>
            <p>The Practice Test is divided into 30 random questions from each unit in the course.</p>
            <hr />
            <ul>
              <li>Unit 1: Limits and Continuity (10-12%)</li>
              <li>Unit 2: Differentiation: Definition and Fundamental Properties (10-12%)</li>
              <li>Unit 3: Differentiation: Composite, Implicit, and Inverse Functions (9-13%)</li>
              <li>Unit 4: Contextual Applications of Differentiation (10-15%)</li>
              <li>Unit 5: Analytical Applications of Differentiation (15-18%)</li>
              <li>Unit 6: Integration and Accumulation of Change (17-20%)</li>
              <li>Unit 7: Differential Equations (6-12%)</li>
              <li>Unit 8: Applications of Integration (10-15%)</li>
            </ul>
            <div className={"container"}>
              <button
                onClick={() =>
                  this.setState((state, props) => ({ page: PageState.Exam, picked: this.pickQuestions() }))
                }
              >
                Begin
              </button>
            </div>
            <footer>
              <button
                className={"outline secondary"}
                onClick={() => this.setState((state, props) => ({ page: PageState.ExploreQuestions }))}
              >
                Explore All Questions
              </button>
            </footer>
          </article>
        );

      case PageState.Exam:
        return (
          <article>
            <header>
              <div className={"grid"}>
                <h2>Practice Test</h2>
                <button
                  style={{ float: "right" }}
                  className={"secondary outline"}
                  onClick={() => this.setState((state, props) => ({ page: PageState.Start, info: null }))}
                >
                  Reset
                </button>
              </div>
            </header>
            <NormalMCQSet
              questions={this.state.picked}
              onFinish={(info) => this.setState((state, props) => ({ page: PageState.End, info: info }))}
            />
          </article>
        );
      case PageState.ExploreQuestions: {
        const questions = this.props.set.questions.map((question, i) => {
          return (
            <article>
              <h3>Question #{i + 1}</h3>
              {questionBreakdown(question, i + 1, null)}
            </article>
          );
        });

        return (
          <article>
            <div className={"grid"}>
              <h2>Practice Test</h2>
              <button onClick={() => this.setState((state, props) => ({ page: PageState.Start }))}>Back</button>
            </div>
            {questions};
          </article>
        );
      }
      case PageState.End: {
        const answers = Array.from(this.state.info!.answers);
        const results = answers.map((kv) => {
          const [n, [correct, picked]] = kv;
          const question = this.state.picked[n];

          return (
            <details>
              <summary style={{ color: correct ? "#60d394" : "#ee6055", fontWeight: "bolder" }}>
                Question #{n + 1}
              </summary>
              <div>{questionBreakdown(question, n + 1, picked)}</div>
            </details>
          );
        });

        const correctCount = answers.reduce((accum, kv) => {
          const [_1, [correct, _2]] = kv;

          return correct ? accum + 1 : accum;
        }, 0);

        return (
          <article>
            <h2>Results</h2>
            <hr />
            <div className={"grid"}>
              <p>
                Correct:{" "}
                <b>
                  {correctCount}/{answers.length}
                </b>
              </p>
              <p>
                Percentage: <b>{Math.round(((correctCount / answers.length) * 100.0 + Number.EPSILON) * 100) / 100}%</b>
              </p>
            </div>
            {results}
          </article>
        );
      }
    }
  }
}

export default MockExam;
