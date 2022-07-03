import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RootStore, RootStoreContext } from "./models/root";

const rootStore = RootStore.create();

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={rootStore}>
            <App />
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();

