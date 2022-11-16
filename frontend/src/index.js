import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RootStore, RootStoreContext } from "./models/root";

const rootStore = RootStore.create();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={rootStore}>
            <App />
        </RootStoreContext.Provider>
    </React.StrictMode>,
);

reportWebVitals();

