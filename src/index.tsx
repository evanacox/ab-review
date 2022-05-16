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
import ReactDOM from "react-dom";
import App from "./App";
import { addStyles } from "react-mathquill";
import { Provider } from "@nteract/mathjax";
import "@picocss/pico";
import "./index.css";

const mathjaxConfig = {
  CommonHTML: {
    scale: 100,
  },
};

// @ts-ignore
window.MathJax = {
  tex: {
    macros: {
      arcsec: "\\DeclareMathOperator{\\arcsec}{arcsec}\\arcsec",
      arccsc: "\\DeclareMathOperator{\\arccsc}{arccsc}\\arccsc",
      arccot: "\\DeclareMathOperator{\\arccot}{arccot}\\arccot",
    },
  },
};

// inject mathquill required styles into <head>
addStyles();

function RootApp(): JSX.Element {
  return (
    <React.StrictMode>
      <Provider options={mathjaxConfig}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

ReactDOM.render(<RootApp />, document.querySelector("root"));
