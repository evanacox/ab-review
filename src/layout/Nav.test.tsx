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
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

test("navbar renders arbitrary name", () => {
  for (const s of ["Hello, Test!", "AB Review", "230948230"]) {
    render(<Nav name={s} />);
    expect(screen.getByText(new RegExp(`${s}`))).toBeInTheDocument();
  }
});
