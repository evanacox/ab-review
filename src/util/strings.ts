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
 * Replaces a substring **if** the needle is not also a part of a different substring
 *
 * @param haystack The whole string to search
 * @param needle The needle to replace
 * @param needleFull The string to check that the needle is not a substring of
 * @param replaceWith The string to replace needleSubstring with
 */
export function replaceIfNotSubstring(
  haystack: string,
  needle: string,
  needleFull: string,
  replaceWith: string
): string {
  const offset = needleFull.indexOf(needle);

  for (let index = haystack.indexOf(needle); index >= 0; index = haystack.indexOf(needle, index + 1)) {
    if (index - offset >= 0 && haystack.indexOf(needleFull, index - offset) === index - offset) {
      continue;
    }

    return haystack.substring(0, index) + replaceWith + haystack.substring(index + needle.length);
  }

  return haystack;
}
