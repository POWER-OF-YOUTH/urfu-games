import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";

const propTypes = {
    className: PropTypes.string
};

function Header({ className = "" }) {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener("resize", () => setIsMobile(window.innerWidth < 1000));
    }, []);

    return (
        <div className={`${styles.container} ${className}`}>
            <Link to="/" className={styles.logo}>
                { isMobile ? "UG" : "UrFU Games" }
            </Link>
            {
                /*
                    <div style={{ width: 30, height: 30, backgroundColor: "black" }}>
                    </div>
                */
            }
        </div>
    );
}

Header.propTypes = propTypes;

export default Header;

