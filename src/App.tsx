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
import Footer from "./layout/Footer";
import Main from "./layout/Main";

export function App(): JSX.Element {
  return (
    <div>
      <Nav name={"Calculus Review"} />
      <Main />
      <Footer
        copyrightStartYear={2022}
        githubLink={"https://www.github.com/evanacox"}
        githubRepoName={"ab-review"}
      />
    </div>
  );
}

export default App;
