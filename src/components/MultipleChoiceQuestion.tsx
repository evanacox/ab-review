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
import { Question, Convert } from "../util/questions.generated";
import Algebrite from "algebrite";

export interface SingleAnswer {
  asInlineAnswer(): JSX.Element;

  asExplanation(): JSX.Element;
}

export class EquationAnswer implements SingleAnswer {
  private readonly latex: string;

  public constructor(data: string) {
    this.latex = data;
  }

  asExplanation(): JSX.Element {
    return <Node>{this.latex}</Node>;
  }

  asInlineAnswer(): JSX.Element {
    return <Node inline>{this.latex}</Node>;
  }
}

export class TextAnswer implements SingleAnswer {
  private readonly data: string;

  public constructor(data: string) {
    this.data = data;
  }

  asExplanation(): JSX.Element {
    return this.asInlineAnswer();
  }

  asInlineAnswer(): JSX.Element {
    return <p>{this.data}</p>;
  }
}

export class JSXAnswer implements SingleAnswer {
  private readonly data: JSX.Element;

  public constructor(data: JSX.Element) {
    this.data = data;
  }

  asExplanation(): JSX.Element {
    return this.data;
  }

  asInlineAnswer(): JSX.Element {
    return this.data;
  }
}

export class MultipleChoiceQuestion {
  public readonly prompt: JSX.Element;
  public readonly incorrect: SingleAnswer[];
  public readonly correct: SingleAnswer;

  public constructor(prompt: JSX.Element, incorrect: SingleAnswer[], correct: SingleAnswer) {
    this.prompt = prompt;
    this.incorrect = incorrect;
    this.correct = correct;
  }
}

export class MultipleChoiceSet {
  public readonly name: string;
  public readonly questions: MultipleChoiceQuestion[];
  private readonly json: string;

  public constructor(name: string, questions: MultipleChoiceQuestion[], json: string) {
    this.name = name;
    this.questions = questions;
    this.json = json;
  }
}

function chunkFromCharacter(str: string, i: number, open: string, close: string): [string, number] {
  let begin = i + 1;
  let open_count = 1;

  for (let j = begin; j < str.length; ++j) {
    if (str[j] === close) {
      open_count -= 1;

      if (open_count === 0) {
        return [str.substring(begin, j), j];
      }
    } else if (str[j] === open) {
      open_count += 1;
    }
  }

  return [str.substring(begin), str.length];

  // throw new Error("could not properly parse expression! unmatched open/close.\n  string: " + str + "\n  i: " + i);
}

function findTicked(str: string, i: number): [string, number] {
  return chunkFromCharacter(str, i, "`", "`");
}

function findBraced(str: string, i: number): [string, number] {
  return chunkFromCharacter(str, i, "{", "}");
}

function parseMixedString(string: string): JSX.Element {
  const elements = [];
  let orphaned = "";

  const orphanedText = () => {
    if (orphaned !== "") {
      elements.push(orphaned);
      orphaned = "";
    }
  };

  for (let i = 0; i < string.length; ++i) {
    if (string[i] === "{") {
      orphanedText();
      const [elem, new_i] = findBraced(string, i);
      elements.push(<Node inline>{elem}</Node>);
      i = new_i;
    } else if (string[i] === "`") {
      orphanedText();
      const [elem, new_i] = findTicked(string, i);
      elements.push(<Node inline>{elem}</Node>);
      i = new_i;
    } else if (string[i] === "\\" && i + 1 < string.length && string[i + 1] === "n") {
      orphanedText();
      elements.push(<br />);
      i += 1;
    } else {
      orphaned += string[i];
    }
  }

  orphanedText();

  return <span>{elements}</span>;
}

function parsePrompt(prompt: string[]): JSX.Element {
  const promptParts = [];

  for (const part of prompt) {
    promptParts.push(parseSingleAnswer(part).asExplanation());
  }

  return <div>{promptParts}</div>;
}

function parseSingleAnswerFallback(answer: string): JSXAnswer {
  return new JSXAnswer(parseMixedString(answer));
}

function parseSingleAnswer(answer: string): SingleAnswer {
  if (answer[0] === "`" && answer[answer.length - 1] === "`") {
    const [elem, end] = findTicked(answer, 0);

    if (end !== answer.length - 1) {
      return parseSingleAnswerFallback(answer);
    }

    // some stuff may or may not be understandable by Nerdamer (e.g `f(g'(x))`), if it
    // isn't we just fall back to trying it as LaTeX
    try {
      return new EquationAnswer(Algebrite.printlatex(elem));
    } catch (_) {
      return new EquationAnswer(elem);
    }
  }

  if (answer[0] === "{" && answer[answer.length - 1] === "}") {
    const [elem, end] = findBraced(answer, 0);

    if (end !== answer.length - 1) {
      return parseSingleAnswerFallback(answer);
    }

    return new EquationAnswer(elem);
  }

  return parseSingleAnswerFallback(answer);
}

function parseQuestion(question: Question): MultipleChoiceQuestion {
  const prompt = parsePrompt(question.prompt);
  const answers = [];

  for (const answer of question.incorrectAnswers) {
    answers.push(parseSingleAnswer(answer));
  }

  return new MultipleChoiceQuestion(prompt, answers, parseSingleAnswer(question.correctAnswer));
}

export function questionsFromJSON(json: string): MultipleChoiceQuestion[] {
  const data = Convert.toQuestion(json);
  const mc_questions: MultipleChoiceQuestion[] = [];

  for (const question of data) {
    mc_questions.push(parseQuestion(question));
  }

  return mc_questions;
}
