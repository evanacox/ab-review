//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { elementaryIntegrableFunction, Equation, EquationBase, monomial, sumDiffOfLength } from "./equations";
import * as math from "mathjs";
import { manipulatedEquationIntoLatex } from "./style";
import { randomBoolWithChance, randomWithin } from "../util/random";

export interface IntegralProblem {
  integrand: Equation;
  correct: Equation;
}

function integrandSimplify(eq: string): string {
  return math.derivative(eq, "x", { simplify: false }).toString({ parentheses: "all" });
}

export function trivial(): IntegralProblem {
  const fn = elementaryIntegrableFunction();
  const unambiguous = integrandSimplify(fn.asTextual());

  return {
    integrand: new EquationBase(manipulatedEquationIntoLatex(unambiguous), unambiguous),
    correct: fn,
  };
}

export function trivialSet(): IntegralProblem {
  const fn = sumDiffOfLength(randomWithin(2, 4), elementaryIntegrableFunction);
  const unambiguous = integrandSimplify(fn.asTextual());

  return {
    integrand: new EquationBase(manipulatedEquationIntoLatex(unambiguous), unambiguous),
    correct: fn,
  };
}

export function uSubstitution(): IntegralProblem {
  const fn = elementaryIntegrableFunction(monomial());
  const unambiguous = integrandSimplify(fn.asTextual());

  return {
    integrand: new EquationBase(manipulatedEquationIntoLatex(unambiguous), unambiguous),
    correct: fn,
  };
}

export function randomIntegral(): IntegralProblem {
  if (randomBoolWithChance(0.3)) {
    return uSubstitution();
  } else if (randomBoolWithChance(0.3)) {
    return trivialSet();
  } else {
    return trivial();
  }
}
