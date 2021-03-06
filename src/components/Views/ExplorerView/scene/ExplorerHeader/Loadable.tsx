import React from "react";
import Loadable from "react-loadable";

export default Loadable({
  loader: () => import("./ExplorerHeader"),
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "191px",
        minHeight: "191px",
        background: "rgba(0, 108, 255, 0.7)",
      }}
    />
  ),
});
