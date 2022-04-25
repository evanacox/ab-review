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
import Footer from "./Footer";

test("navbar renders current year correctly", () => {
  const currYear = new Date().getFullYear();

  render(
    <Footer copyrightStartYear={currYear} githubLink={""} githubRepoName={""} />
  );

  expect(
    screen.getByText(new RegExp(`© ${currYear} Evan Cox.`))
  ).toBeInTheDocument();
});

test("navbar renders previous year correctly", () => {
  const currYear = new Date().getFullYear() - 1;

  render(
    <Footer copyrightStartYear={currYear} githubLink={""} githubRepoName={""} />
  );

  expect(
    screen.getByText(new RegExp(`© ${currYear}-${currYear + 1} Evan Cox.`))
  ).toBeInTheDocument();
});
