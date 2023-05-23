import React from "react";
import styles from "./NavDeleteButton.module.css";
import { Slide, Popper, Button, MenuList, MenuItem, ListItemIcon, ClickAwayListener, Menu } from "@mui/material";

function NavDeleteButton({ text, className, href, onClick }) {
    return (
        <div
            className={`
        ${styles.main}
        ${className ?? ""} `}

            // style={{
            //     textTransform: "none",
            //     color: "black",
            //     fontWeight: "bold",
            //     borderRadius: "8px",
            //     border: "2px solid rgba(4, 99, 234, 1)",
            //     width: "200px",
            //     heigh: "34px"
            // }}
        >
            <div className={styles.btntext}><a className={styles.btnlink} onClick={onClick} href={href}>{text}</a></div> 
        </div>
    );
}

export default NavDeleteButton;
