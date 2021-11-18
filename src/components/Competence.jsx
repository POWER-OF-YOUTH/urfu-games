import React from "react";
import { Link } from "react-router-dom";

import styles from "./Competence.module.css";

function Competence({ id = "", color = "orange", children }) {
    return (
        <div className={styles.container} style={{ backgroundColor: color }}>
            <div className={styles.competenceLink}>
                {children}
            </div>
        </div>
    );
}

export default Competence;
