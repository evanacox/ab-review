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

export interface NavProps {
  name: string;
}

export function Nav(props: NavProps): JSX.Element {
  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <strong>{props.name}</strong>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#">Integration</a>
        </li>
        <li>
          <a href="#">Differentiation</a>
        </li>
        <li>
          <a href="#" role="button">
            Random
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
