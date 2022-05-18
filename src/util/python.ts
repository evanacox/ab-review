//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

export async function runPythonAsync(code: string): Promise<string> {
  try {
    // @ts-ignore
    return window.pyodide.runPythonAsync("import sympy\n" + code);
  } catch (e) {
    return "";
  }
}

export function runPython(code: string): string {
  // @ts-ignore
  if (window.pyodide === undefined) {
    return "";
  }

  try {
    // @ts-ignore
    return window.pyodide.runPython("import sympy\n" + code);
  } catch (e) {
    return "";
  }
}
