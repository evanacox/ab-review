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

export interface EquationInputProps {}

interface EquationState {
  input: string;
}

export class EquationInput extends React.Component<EquationInputProps, {}> {
  public state: EquationState;

  public constructor(props: EquationInputProps) {
    super(props);
    this.state = { input: "" };
  }

  public render(): JSX.Element {
    return <h1>Equation Input!</h1>;
  }
}

export default EquationInput;
