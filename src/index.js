import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { RootStore, RootStoreContext } from "./models/root";

/* MobX заметки */
/*
    Если мы переходим между страницами сайта с помощью компонента Link,
    хранилище, передаваемое через контекст, сохраняет своё состояние, 
    т.е. не пересоздаётся.

    Если обновить страницу, хранилище будет создано заново.
*/

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={RootStore.create()}>
            <App />
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
