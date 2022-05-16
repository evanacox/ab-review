//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { randomArrayElement, randomBoolWithChance, randomWithin } from "../util/random";
import { intoLatex } from "./style";

export interface Equation {
  asLatex(): string;

  asTextual(): string;

  displayLatex(): string;
}

export class EquationBase implements Equation {
  private readonly latex: string;
  private readonly textual: string;

  public constructor(latex: string, textual: string) {
    this.latex = latex;
    this.textual = textual;
  }

  public asLatex(): string {
    return this.latex;
  }

  public asTextual(): string {
    return this.textual;
  }

  public displayLatex(): string {
    return (
      "\\DeclareMathOperator{\\arcsec}{arcsec}" +
      "\\DeclareMathOperator{\\arccsc}{arccsc}" +
      "\\DeclareMathOperator{\\arccot}{arccot}" +
      this.latex
    );
  }
}

function rawFunction(s: string): Equation {
  return new EquationBase("{\\" + s + "}", s);
}

function rawEquation(s: string): Equation {
  return new EquationBase(s, s);
}

export function empty(): Equation {
  return rawEquation("");
}

export function x(): Equation {
  return rawEquation("x");
}

function combineMaybeEmpty(a: Equation, b: Equation): Equation {
  return new EquationBase(a.asLatex() + b.asLatex(), a.asTextual() + b.asTextual());
}

export function sum(a: Equation, b: Equation): Equation {
  if (a.asLatex() === "" || b.asLatex() === "") {
    return combineMaybeEmpty(a, b);
  }

  return new EquationBase(
    "{" + a.asLatex() + " + " + b.asLatex() + "}",
    "(" + a.asTextual() + " + " + b.asTextual() + ")"
  );
}

export function difference(a: Equation, b: Equation): Equation {
  if (a.asLatex() === "" || b.asLatex() === "") {
    return combineMaybeEmpty(a, b);
  }

  return new EquationBase(
    "{" + a.asLatex() + " - " + b.asLatex() + "}",
    "(" + a.asTextual() + " - " + b.asTextual() + ")"
  );
}

export function multiply(a: Equation, b: Equation): Equation {
  if (a.asLatex() === "" || b.asLatex() === "") {
    return combineMaybeEmpty(a, b);
  }

  return new EquationBase(
    "{" + a.asLatex() + "}{" + b.asLatex() + "}",
    "(" + a.asTextual() + " * " + b.asTextual() + ")"
  );
}

export function fraction(a: Equation, b: Equation): Equation {
  if (a.asLatex() === "" || b.asLatex() === "") {
    return combineMaybeEmpty(a, b);
  }

  return new EquationBase(
    "\\frac{" + a.asLatex() + "}{" + b.asLatex() + "}",
    "(" + a.asTextual() + " / " + b.asTextual() + ")"
  );
}

export function constantBetween(min: number = 2, max: number = 6): Equation {
  const n = randomWithin(min, max).toString();

  return new EquationBase("{" + n + "}", "(" + n + ")");
}

export function constantOf(n: number): Equation {
  return rawEquation(n.toString());
}

export function constant(): Equation {
  if (randomBoolWithChance(0.3)) {
    return fraction(constantBetween(), constantBetween());
  }

  return constantBetween();
}

function emptyOrConstant(n: number | null): Equation {
  return n === null ? empty() : constantOf(n);
}

const trigConstantParts = [
  [null, null],
  [null, 2],
  [5, 2],
  [9, 2],
  [3, 2],
  [7, 2],
  [11, 2],
  [2, null],
  [4, null],
];

export function pi(): Equation {
  return new EquationBase("{\\pi}", "(pi)");
}

/**
 * Gets a "trig constant" (a constant involving `pi`) that should be straightforward
 * enough to plug into trig equations, i.e. it should be something that can be evaluated
 * using a unit circle. Note that this does not include
 */
export function trigConstant(): Equation {
  const [coefficient, denominator] = randomArrayElement(trigConstantParts);

  return fraction(multiply(emptyOrConstant(coefficient), pi()), emptyOrConstant(denominator));
}

/**
 * Gets a monomial of the form `(coefficient) * (variable)^(power)`.
 *
 * @param variable The variable to use for `x`
 * @param power The power to raise `variable` to
 * @param coefficient The coefficient to multiply `variable^power` by
 */
export function monomial(
  variable: Equation = x(),
  power: Equation = constant(),
  coefficient: Equation = constant()
): Equation {
  return multiply(
    coefficient,
    new EquationBase(
      "{" + variable.asLatex() + "^" + power.asLatex() + "}",
      "(" + variable.asTextual() + "^" + power.asTextual() + ")"
    )
  );
}

function replaceDollar(eq: Equation, replaceWith: Equation): Equation {
  return new EquationBase(
    eq.asLatex().replaceAll("$", replaceWith.asLatex()),
    eq.asTextual().replaceAll("$", replaceWith.asTextual())
  );
}

function replaceDollarAndConstant(
  eq: Equation,
  replaceDollarWith: Equation,
  replaceConstantWith: () => Equation
): Equation {
  let dollarReplacedLatex = eq.asLatex().replaceAll("$", replaceDollarWith.asLatex());
  let dollarReplacedTextual = eq.asTextual().replaceAll("$", replaceDollarWith.asTextual());

  if (eq.asLatex().includes("___")) {
    const replaced = replaceConstantWith();

    dollarReplacedLatex = dollarReplacedLatex.replaceAll("___", replaced.asLatex());
    dollarReplacedTextual = dollarReplacedTextual.replaceAll("___", replaced.asTextual());
  }

  return new EquationBase(dollarReplacedLatex, dollarReplacedTextual);
}

const standardTrigFunctions: Equation[] = [
  rawFunction("sin($)"),
  rawFunction("cos($)"),
  rawFunction("tan($)"),
  rawFunction("sec($)"),
  rawFunction("csc($)"),
  rawFunction("cot($)"),
];

/**
 * Returns a trig function (or product/composition/whatever of trig functions) that can be differentiated using
 * "normal" rules
 *
 * @param inner The inner equation to use instead of `x`. Result will be `fn(inner)`
 */
export function differentiableTrigFunction(inner: Equation = x()): Equation {
  return replaceDollar(randomArrayElement(standardTrigFunctions), inner);
}

const integrableTrigFunctions: Equation[] = [
  ...standardTrigFunctions,
  new EquationBase("{\\sec^{2}($)}", "((sec($))^2)"),
  new EquationBase("{{\\sec($)}{\\tan($)}}", "(sec($) * tan($))"),
  new EquationBase("{\\csc^{2}($)}", "((csc($))^2)"),
  new EquationBase("{{\\csc($)}{\\cot($)}}", "(csc($) * cot($))"),
];

/**
 * Returns a trig function (or product/composition/whatever of trig functions) that can be integrated using
 * "normal" means when `inner` has a derivative of `1`.
 *
 * Note that this means that a complex `inner` will need to have its derivative handled for real problems.
 *
 * @param inner The inner equation to use instead of `x`. Result will be `fn(inner)`
 */
export function integrableTrigFunction(inner: Equation = x()): Equation {
  return replaceDollar(randomArrayElement(integrableTrigFunctions), inner);
}

const inverseTrigFunctions: Equation[] = [
  rawFunction("arcsin($)"),
  rawFunction("arccos($)"),
  rawFunction("arctan($)"),
  rawFunction("arcsec($)"),
  rawFunction("arccsc($)"),
  rawFunction("arccot($)"),
];

/**
 * Returns an inverse trig function that can be differentiated using "normal" rules
 *
 * @param inner The inner equation to use instead of `x`. Result will be `fn(inner)`
 */
export function inverseTrigFunction(inner: Equation = x()): Equation {
  return replaceDollar(randomArrayElement(inverseTrigFunctions), inner);
}

const nonTrigIntegrableFunctions: Equation[] = [
  new EquationBase("e^{$}", "e^($)"),
  new EquationBase("___^{$}", "___^($)"),
  new EquationBase("\\sqrt{$}", "sqrt($)"),
  new EquationBase("{$}^{___}", "($)^(___)"),
];

/**
 * Gets an elementary integrable function that is not also a trig function.
 *
 * @param inner The inner equation to use instead of `x`.
 */
export function nonTrigIntegrableFunction(inner: Equation = x()): Equation {
  return replaceDollarAndConstant(randomArrayElement(nonTrigIntegrableFunctions), inner, constantBetween);
}

const nonTrigDifferentiableFunctions: Equation[] = [
  ...nonTrigIntegrableFunctions,
  new EquationBase("\\ln{$}", "ln($)"),
];

/**
 * Gets an elementary differentiable function that is not also a trig function.
 *
 * @param inner The inner equation to use instead of `x`.
 */
export function nonTrigDifferentiableFunction(inner: Equation = x()): Equation {
  return replaceDollarAndConstant(randomArrayElement(nonTrigDifferentiableFunctions), inner, constantBetween);
}

/**
 * Gets an elementary function that can be integrated using "normal" rules
 *
 * @param inner The inner equation to use instead of `x`.
 */
export function elementaryIntegrableFunction(inner: Equation = x()): Equation {
  if (randomBoolWithChance(0.5)) {
    return integrableTrigFunction(inner);
  }

  return nonTrigIntegrableFunction(inner);
}

/**
 * Creates a combination of sums/differences of equations, with a set number of equations.
 *
 * @param length The number of equations to generate
 * @param equation The function to call to generate equations
 */
export function sumDiffOfLength(length: number, equation: () => Equation): Equation {
  let eq = empty();

  for (let i = 0; i < length; ++i) {
    const next = equation();

    eq = randomBoolWithChance(0.5) ? sum(eq, next) : difference(eq, next);
  }

  return eq;
}
