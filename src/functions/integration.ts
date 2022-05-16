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
  constant,
  differentiableTrigFunction,
  elementaryIntegrableFunction,
  Equation,
  EquationBase,
  integrableTrigFunction,
  inverseTrigFunction,
  monomial,
  trigConstant,
  x,
} from "./equations";
import * as math from "mathjs";
import { randomBoolWithChance } from "../util/random";
import { intoLatex } from "./style";

export function uSubstitution(): Equation {
  const eq = randomBoolWithChance(0.3)
    ? integrableTrigFunction(monomial(x(), constant(), trigConstant()))
    : elementaryIntegrableFunction(monomial());

  console.log(eq.asTextual());

  const derivative = math.derivative(math.simplify(eq.asTextual()), "x", { simplify: false });
  const unambiguous = derivative.toString({ parentheses: "all" });

  return new EquationBase(intoLatex(unambiguous), unambiguous);
}
