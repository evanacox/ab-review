//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { MultipleChoiceQuestion } from "../components/MultipleChoiceQuestion";

export interface MCQSetCorrectIncorrectInfo {
  answers: Map<number, boolean>;
}

export interface MCQSetProps {
  questions: MultipleChoiceQuestion[];
  onFinish: (info: MCQSetCorrectIncorrectInfo) => void;
}

export interface MCQSetState {
  questionIndex: number;
  needChange: boolean;
  info: MCQSetCorrectIncorrectInfo;
}
