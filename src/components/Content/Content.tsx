import React from "react";
import { Switch, Route, Redirect } from "react-router";

import ExplorerView from "../Views/ExplorerView/Loadable";

import "./Content.scss";

const Content = () => (
  <div className="content-container">
    <Switch>
      <Route path="/explorer" component={ExplorerView} />
      <Route path="/" render={() => <Redirect to="/explorer" />} />
    </Switch>
  </div>
);

export default Content;
