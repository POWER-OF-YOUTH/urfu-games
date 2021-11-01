import React from "react";
import { Link } from "react-router-dom";

import styles from "./Competence.module.css";

function Competence({ id = "", color = "orange", children }) {
    return (
        <div className={styles.container} style={{ backgroundColor: color }}>
            <Link to={`/competencies/${id}`} className={styles.competenceLink}>
                {children}
            </Link>
        </div>
    );
}

export default Competence;

