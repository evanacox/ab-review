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
import { MultipleChoiceSet, questionsFromJSON } from "../components/MultipleChoiceQuestion";

export enum Page {
  Home,
  Integration,
  Differentiation,
  MockExam,
}

export interface NavProps {
  name: string;
  onQuestionUpload: (set: MultipleChoiceSet) => void;
  onPageChange: (page: Page) => void;
}

export class Nav extends React.Component<NavProps, {}> {
  private readonly fileUploader: React.RefObject<HTMLInputElement>;
  private readonly nameModal: React.RefObject<HTMLElement>;
  private readonly errorModal: React.RefObject<HTMLElement>;

  public constructor(props: NavProps) {
    super(props);

    this.fileUploader = React.createRef();
    this.nameModal = React.createRef();
    this.errorModal = React.createRef();
  }

  public render(): JSX.Element {
    return (
      <nav className="container-fluid">
        <ul>
          <li>
            <strong>{this.props.name}</strong>
          </li>
        </ul>
        <ul>
          <li>
            <a href="#" onClick={() => this.props.onPageChange(Page.Integration)}>
              Integration
            </a>
          </li>
          <li>
            <a href="#" onClick={() => this.props.onPageChange(Page.Differentiation)}>
              Differentiation
            </a>
          </li>
          <li>
            <input
              ref={this.fileUploader}
              id={"mcq-uploader"}
              onInput={(_) => this.onFileUpload()}
              type="file"
              style={{ display: "none" }}
            />
            <a href="#" onClick={() => this.onUploaderClick()}>
              Upload Questions
            </a>
          </li>
          <li>
            <a href="#" role="button" onClick={() => this.props.onPageChange(Page.MockExam)}>
              Mock Exam
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  private onUploaderClick(): void {
    this.fileUploader.current!.click();
  }

  private onFileUpload(): void {
    const file = this.fileUploader.current!.files![0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const json = reader.result as string;
      const questions = questionsFromJSON(json);

      this.props.onQuestionUpload(new MultipleChoiceSet("", questions, json));
    });

    reader.readAsText(file);
  }
}

export default Nav;
