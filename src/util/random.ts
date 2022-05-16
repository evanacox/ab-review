//======---------------------------------------------------------------======//
//                                                                           //
// Copyright 2022 Evan Cox <evanacox00@gmail.com>. All rights reserved.      //
//                                                                           //
// Use of this source code is governed by a BSD-style license that can be    //
// found in the LICENSE file at the root of this project, or at the          //
// following link: https://opensource.org/licenses/BSD-3-Clause              //
//                                                                           //
//======---------------------------------------------------------------======//

/**
 * Gets a random integer value in the range `[min, max]`
 *
 * @param min The minimum value to be returned
 * @param max The maximum value to be returned
 */
export function randomWithin(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Gets a boolean with a `chance` chance of being `true`
 *
 * @param chance The chance of the output being true
 */
export function randomBoolWithChance(chance: number): boolean {
  return Math.random() <= chance;
}

/**
 * Chooses a random element of `array`, with equal probability being given to each element
 *
 * @param array The array to select from
 */
export function randomArrayElement<T>(array: T[]): T {
  return array[randomWithin(0, array.length - 1)];
}
