//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { replaceIfNotSubstring } from "./strings";

test("replaceIfNotSubstring works", () => {
  expect(replaceIfNotSubstring("\\int{}^{}", "int", "\\int{}^{}", "\\int{}^{}")).toBe("\\int{}^{}");
  expect(replaceIfNotSubstring("int", "int", "\\int{}^{}", "\\int{}^{}")).toBe("\\int{}^{}");
  expect(replaceIfNotSubstring("\\int{}^{}int", "int", "\\int{}^{}", "\\int{}^{}")).toBe("\\int{}^{}\\int{}^{}");
});
