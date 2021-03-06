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

export interface FooterProps {
  copyrightStartYear: number;
  githubLink: string;
  githubRepoName: string;
}

export function Footer(props: FooterProps): JSX.Element {
  const licenseLink = `${props.githubLink}/${props.githubRepoName}/blob/master/LICENSE`;

  return (
    <footer className={"container-fluid"}>
      <small>
        Distributed under the&nbsp;
        <a href={licenseLink} className={"secondary"}>
          BSD 3-Clause License
        </a>
        .
      </small>
    </footer>
  );
}

export default Footer;
