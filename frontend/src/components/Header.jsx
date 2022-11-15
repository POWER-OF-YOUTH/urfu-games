import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
    Slide,
    Popper,
    Button,
    MenuList,
    MenuItem,
    ListItemIcon,
    ClickAwayListener
} from "@mui/material";
import { styled } from "@mui/material";
import {
    Logout as LogoutIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Settings as SettingsIcon,
    AccountCircle as UserProfileIcon,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { useStore, useIsMobile } from "../hooks";

import styles from "./Header.module.css";

/*
 * @param {{ variant: "standard" | "hidebuttons" | "hideall" }}
 */
function Header({ variant = "standard" }) {
    const location = useLocation();
    const { auth } = useStore();

    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    let showAuthButtons, showUser;
    if (variant === "standard") {
        showAuthButtons = true;
        showUser = true;
    }
    else if (variant === "hidebuttons") {
        showAuthButtons = false;
        showUser = true;
    }
    else if (variant === "hideall") {
        showAuthButtons = false;
        showUser = false;
    }
    else {
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

    return (
        <>
            <div className={styles.spacer}>
                <header>
                    <Logo />
                    {auth.authenticated ? (
                        showUser && <User user={auth.user} onClick={handleUserClick} /> 
                    ) : (
                        showAuthButtons && (
                            <div className={styles.authButtonsContainer}>
                                <NavLink 
                                    className={styles.signInLink} 
                                    to={{
                                        pathname: "/signin", 
                                        state: { redirectTo: location.pathname }
                                    }}
                                >
                                    <SignInButton variant="contained" size="small">
                                        Войти
                                    </SignInButton>
                                </NavLink>
                                <NavLink 
                                    className={styles.signUpLink} 
                                    to={{
                                        pathname: "/signup", 
                                        state: { redirectTo: location.pathname }
                                    }}
                                >
                                    Зарегистрироваться
                                </NavLink>
                            </div>
                        )
                    )
                    }
                    <Popper 
                        open={isMenuOpen}
                        anchorEl={menuAnchorElement}
                        onClose={handleMenuClose} 
                        MenuListProps={{"aria-labelledby": "basic-button"}}
                        placement="bottom-end"
                        transition
                    >
                        {({ TransitionProps }) => 
                            <Slide {...TransitionProps}>
                                <div className={styles.menuListContainer}>
                                    <ClickAwayListener onClickAway={handleMenuClose}>
                                        <MenuList>
                                            <MenuItem component = {Link} to = {"/users/" + auth.user.id}>
                                                <ListItemIcon>
                                                    <UserProfileIcon/>
                                                </ListItemIcon>
                                                <span className={styles.userProfileText}>Профиль</span>
                                            </MenuItem>
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <SettingsIcon />
                                                </ListItemIcon>
                                                <span className={styles.settingsText}>Настройки</span>
                                            </MenuItem>
                                            <MenuItem onClick={handleLogoutClick}>
                                                <ListItemIcon>
                                                    <LogoutIcon />
                                                </ListItemIcon>
                                                <span className={styles.exitText}>Выйти</span>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </div>
                            </Slide>
                        }
                    </Popper>
                </header>
            </div>
        </>
    );
}

function Logo() {
    const isMobile = useIsMobile();

    return (
        <div className={styles.logoContainer}>
            <Link to="/" className={styles.logo}>
                { isMobile ? "UG" : "UrFU Games" }
            </Link>
        </div>
    );
}

const SignInButton = styled(Button)({
    backgroundColor: "#84DCC6",
    color: "black",
    fontWeight: "bold",
    "&:hover": {
        backgroundColor: "white"
    }
});

function User({ user, onClick }) {
    const handleClick = (evt) => onClick(evt);

    const Login = styled("span")({
        color: user.isAdmin() ? "red" : "white"
    });

    return (
        <div className={styles.userContainer} onClick={handleClick}>
            <Login className={`${styles.login}`}>{user.login}</Login>
            <div className={styles.avatar}>
                <img alt="avatar" src={user.avatar} />
            </div>
            <div className={styles.menu}>
                <ArrowDropDownIcon className={styles.menuIcon} />
            </div>
        </div>
    );
}

export default observer(Header);
