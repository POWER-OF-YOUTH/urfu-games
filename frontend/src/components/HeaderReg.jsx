import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Slide, Popper, Button, MenuList, MenuItem, ListItemIcon, ClickAwayListener, Menu, Autocomplete, TextField } from "@mui/material";
import { styled } from "@mui/material";
import {
    Logout as LogoutIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Settings as SettingsIcon,
    AccountCircle as UserProfileIcon,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { useStore, useIsMobile } from "../hooks";

import panelButton from "../components/svg/panelButton.svg";
import buttonBells from "../components/svg/buttonBells.svg";
import NavButton from "./NavButton.jsx";
import NavMainButton from "./NavMainButton.jsx";
import styles from "./HeaderReg.module.css";

/*  
 * @param {{ variant: "standard" | "hidebuttons" | "hideall" }}
 */
function HeaderReg({ variant = "standard", onChange }) {
    const location = useLocation();
    const { auth } = useStore();

    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    let showAuthButtons, showUser;
    if (variant === "standard") {
        showAuthButtons = true;
        showUser = true;
    } else if (variant === "hidebuttons") {
        showAuthButtons = false;
        showUser = true;
    } else if (variant === "hideall") {
        showAuthButtons = false;
        showUser = false;
    } else {
        showAuthButtons = true;
        showUser = true;
    }

    const handleUserClick = (evt) => {
        setMenuAnchorElement(evt.currentTarget);
        setIsMenuOpen(true);
    };
    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };
    const handleLogoutClick = () => {
        auth.logout();
        setIsMenuOpen(false);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    

    return (
        <>
            <div className={styles.spacer}>
                <div className={styles.blockHeader}>
                    <Logo />

                </div>
            </div>
        </>
    );
}

function Logo() {
    const isMobile = useIsMobile();

    return (
        <div className={styles.logoContainer}>
            <a href={"/"} className={styles.leftSideLogo} >
                {isMobile ? "U" : "UrFU"}
            </a>
            <a href={"/"} className={styles.rightSideLogo}>
                {isMobile ? "G" : "Games"}
            </a>
        </div>
    );
}




const SignInButton = styled(Button)({
    backgroundColor: "var(--main-color)",
    color: "white",
    fontWeight: "bold",
    // "&:hover": {
    //     backgroundColor: "white"
    // }
});

function User({ user, onClick }) {
    const handleClick = (evt) => onClick(evt);

    const Login = styled("span")({
        color: user.isAdmin() ? "red" : user.isModerator() ? "green" : "black",
    });
    return (
        <div className={styles.userContainer} onClick={handleClick} >            
            <Login className={`${styles.login}`}>{user.login}</Login>
            <Link to={"/users/" + user.id}>            
                <div className={styles.avatar}>
                    <img alt="avatar" src={user.avatar} />
                </div>
            </Link>
        </div>
    );
}

export default observer(HeaderReg);
