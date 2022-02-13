import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RootStore, RootStoreContext } from "./models/root";

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={RootStore.create()}>
            <App />
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();

