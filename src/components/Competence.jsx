import React from "react";
import { Link } from "react-router-dom";

import styles from "./Competence.module.css";

// const Competence = {
//     Small: function Small({ id = "", color = "orange", children }) {
//         return (
//             <div className={styles.container} style={{ backgroundColor: color, width: '80px' }}>
//                 <Link to={`/competencies/${id}`} className={styles.competenceLink}>
//                     {children}
//                 </Link>
//             </div>
//         );
//     },
//     Regular: function Regular({ id = "", color = "orange", children }) {
//         return (
//             <div className={styles.container} style={{ backgroundColor: color, width: '120px' }}>
//                 <Link to={`/competencies/${id}`} className={styles.competenceLink}>
//                     {children}
//                 </Link>
//             </div>
//         );
//     },
//     Large: function Large({ id = "", color = "orange", children }) {
//         return (
//             <div className={styles.container} style={{ backgroundColor: color, width: '240px' }}>
//                 <Link to={`/competencies/${id}`} className={styles.competenceLink}>
//                     {children}
//                 </Link>
//             </div>
//         );
//     },    
// };

function Competence({ id = "", color = "orange", width = "80px", children }) {
    return (
        <div className={styles.container} style={{ backgroundColor: color, width: width }}>
            <div className={styles.competenceLink}>
                {children}
            </div>
        </div>
    );
}

export default Competence;
