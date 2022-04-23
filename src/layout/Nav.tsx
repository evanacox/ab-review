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

interface Props {
  name: string;
}

export default function Nav(props: Props): JSX.Element {
  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <strong>{props.name}</strong>
        </li>
      </ul>
      <ul>
        <li>
          <a href="src/layout/Nav#">Link</a>
        </li>
        <li>
          <a href="src/layout/Nav#">Link</a>
        </li>
        <li>
          <a href="src/layout/Nav#" role="button">
            Button
          </a>
        </li>
      </ul>
    </nav>
  );
}
