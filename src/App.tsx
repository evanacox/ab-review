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
import Nav, { Page } from "./layout/Nav";
import Footer from "./layout/Footer";
import Main from "./layout/Main";
import { MultipleChoiceSet } from "./components/MultipleChoiceQuestion";

interface AppState {
  questionSets: MultipleChoiceSet[];
  page: Page;
}

export class App extends React.Component<{}, AppState> {
  public constructor(props: any) {
    super(props);

    this.state = { questionSets: [], page: Page.Home };
  }

  public render(): JSX.Element {
    return (
      <div>
        <Nav
          name={"Calculus Review"}
          onQuestionUpload={(set) => {
            console.log("got question set! ", set);

            this.setState((state, _) => {
              state.questionSets.push(set);

              return state;
            });
          }}
          onPageChange={(page) => this.setState((state, props) => ({ questionSets: state.questionSets, page: page }))}
        />
        <Main set={this.state.questionSets.length > 0 ? this.state.questionSets[0] : null} page={this.state.page} />
        <Footer copyrightStartYear={2022} githubLink={"https://www.github.com/evanacox"} githubRepoName={"ab-review"} />
      </div>
    );
  }
}

export default App;
