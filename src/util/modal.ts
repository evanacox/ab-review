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

const modalIsOpen = "modal-is-open";
const modalIsOpening = "modal-is-opening";
const modalIsClosing = "modal-is-closing";
const modalOpen = "open";
const duration = 400;

export function openModal(ref: React.RefObject<HTMLElement>): void {
  const modal = ref.current!;

  modal.setAttribute(modalOpen, "");
  document.documentElement.classList.add(modalIsOpen, modalIsOpening);

  setTimeout(() => document.documentElement.classList.remove(modalIsOpening), duration);
}

export function closeModal(ref: React.RefObject<HTMLElement>): void {
  const modal = ref.current!;

  document.documentElement.classList.add(modalIsClosing);

  setTimeout(() => {
    document.documentElement.classList.remove(modalIsOpen, modalIsClosing);
    modal.removeAttribute(modalOpen);
  }, duration);
}

export function forceCloseWithoutAnimation(ref: React.RefObject<HTMLElement>): void {
  document.documentElement.classList.remove(modalIsOpen, modalIsClosing, modalIsOpening);
  ref.current!.removeAttribute(modalOpen);
}
