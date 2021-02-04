import React from "react";

import ExplorerHeader from "./scene/ExplorerHeader/Loadable";
import ExplorerContent from "./scene/ExplorerContent/Loadable";
import { Web3Context } from "../../../contexts/Web3Context";

import "./ExplorerView.scss";

const ExplorerView = () => (
  <main className="explorerview-container">
    <Web3Context.Consumer>
      {({ state, actions }) => (
        <>
          {/* Page content with block cards  */}
          <ExplorerContent
            blocks={state.blocks}
            blockRangeVisible={state.blockRangeVisible}
            getMoreBlocks={actions.getMoreBlocks}
            showNewerBlocks={actions.showNewerBlocks}
          />
        </>
      )}
    </Web3Context.Consumer>
  </main>
);

export default ExplorerView;
