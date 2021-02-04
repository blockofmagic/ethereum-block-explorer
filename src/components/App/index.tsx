import React from "react";

import { Web3ContextProvider } from "../../contexts/Web3Context";
import ExplorerView from "../Views/ExplorerView/Loadable";

const App = () => (
  <Web3ContextProvider>
    <ExplorerView />
  </Web3ContextProvider>
);

export default App;
