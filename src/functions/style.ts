//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import Algebrite from "algebrite";

function replaceRecursive(str: string, pattern: string | RegExp, what: string): string {
  const fixed = str.replace(pattern, what);

  if (fixed === str) {
    return fixed;
  }

  return fixed.replace(pattern, what);
}

export function manipulatedEquationIntoLatex(eq: string): string {
  //
  // if you find this, I apologize for my sins. I got really lazy and just wanted to fix the
  // freaking formatting of my LaTeX for some of the more complicated problems, this was the result.
  //
  // Please forgive me.
  //
  eq = eq.replaceAll(/((\*|\/|\+)\s-)|(^-)/g, "$1 (-1) * ");
  eq = eq.replaceAll("-(-1)", "");
  let result = Algebrite.run(`printlatex(simplify(${eq}))`);

  // let result = math.simplify(eq).toTex({ implicit: "hide", parentheses: "auto" });

  for (const term of ["sin", "cos", "tan", "sec", "csc", "cot"]) {
    result = result.replaceAll(term, "{\\" + term + "}");
  }

  for (const term of ["arc\\sin", "arc\\cos", "arc\\tan", "arc\\sec", "arc\\csc", "arc\\cot"]) {
    result = result.replaceAll(term, "{\\" + term + "}");
  }

  result = result
    .replaceAll("\\pix", "{\\pi}x")
    .replaceAll(/log\(([\d|])\)/g, "\\ln($1)")
    .replaceAll(/\^\{?1\}?/g, "");

  return replaceRecursive(result, /\{\\(sin|cos|tan|sec|csc|cot)\}\((.*)\)\^\{?(\d)\}?/g, "{\\$1^{$3}($2)}");
}
