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
import Nav from "./layout/Nav";

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Nav name={"Calculus Review"} />
      <main className="container"></main>
    </div>
  );
}
