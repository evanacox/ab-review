//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import {
  differentiableTrigFunction,
  elementaryIntegrableFunction,
  Equation,
  EquationBase,
  monomial,
  sumDiffOfLength,
} from "./equations";
import * as math from "mathjs";
import { manipulatedEquationIntoLatex } from "./style";
import { randomBoolWithChance, randomWithin } from "../util/random";
import Nerdamer from "nerdamer";

export interface DerivativeProblem {
  original: Equation;
  correct: Equation;
}

function diffSimplify(eq: string): string {
  return Nerdamer(
    `simplify(${math.derivative(eq, "x", { simplify: false }).toString({ parentheses: "all" })})`
  ).toTeX();
}

export function trivial(): DerivativeProblem {
  const fn = elementaryIntegrableFunction(monomial());
  const answer = diffSimplify(fn.asTextual());
  const simplified = Nerdamer(`simplify(${fn.asTextual()})`);

  return {
    original: new EquationBase(simplified.toTeX(), simplified.text()),
    correct: new EquationBase(manipulatedEquationIntoLatex(answer), answer),
  };
}

export function trivialSet(): DerivativeProblem {
  const fn = sumDiffOfLength(randomWithin(2, 4), elementaryIntegrableFunction);
  const answer = diffSimplify(fn.asTextual());

  return {
    original: fn,
    correct: new EquationBase(manipulatedEquationIntoLatex(answer), answer),
  };
}

export function randomDerivative(): DerivativeProblem {
  if (randomBoolWithChance(0.3)) {
    return trivialSet();
  } else {
    return trivial();
  }
}
