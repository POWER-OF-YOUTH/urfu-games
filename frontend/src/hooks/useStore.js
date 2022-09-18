import React from "react";

import { RootStoreContext } from "../models/root";

export default function useStore() {
    return React.useContext(RootStoreContext);
}
