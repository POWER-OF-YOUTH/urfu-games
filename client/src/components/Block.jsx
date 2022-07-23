import React from "react";

import styles from "./Block.module.css";

function Block({ className = "", children }) {
    return (
        <div className={`${styles.block} ${className}`}>
            { children }
        </div>
    );
}

export default Block;
