//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

import { randomWithin } from "./random";

export function shuffleInPlace<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomWithin(0, i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function shuffleCopy<T>(array: T[]): T[] {
  const copy = [...array];

  shuffleInPlace(copy);

  return copy;
}
