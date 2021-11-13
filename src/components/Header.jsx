import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
    Slide,
    Popper,
    Button,
    MenuList,
    MenuItem,
    ListItemIcon,
    ClickAwayListener
} from "@mui/material";
import {
    Logout as LogoutIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { RootStoreContext } from "../models/root";

import styles from "./Header.module.css";

/*
 * @param {{ variant: "standard" | "hidebuttons" | "hideall" }}
 */
function Header({ variant = "standard" }) {
    const rootStore = React.useContext(RootStoreContext);
    const authStore = rootStore.authStore;

    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
    const [isMobile, setIsMobile] = React.useState(false);
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

    React.useEffect(() => {
        window.addEventListener("resize", () => setIsMobile(window.innerWidth < 1000));
    }, []);

    const handleUserClick = (evt) => {
        setMenuAnchorElement(evt.currentTarget);
        setIsMenuOpen(true);
    };
    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };
    const handleLogoutClick = () => {
        authStore.logout();
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className={styles.spacer}>
                <header>
                    <div className={styles.logoContainer}>
                        <Link to="/" className={styles.logo}>
                            { isMobile ? "UG" : "UrFU Games" }
                        </Link>
                    </div>
                    {!authStore.isLoading ? 
                        authStore.authenticated ?
                            showUser ? <User user={authStore.user} onClick={handleUserClick} /> : <></> 
                            : 
                            showAuthButtons ?
                                <div className={styles.authButtonsContainer}>
                                    <NavLink className={styles.signInButton} to="/signin">
                                        <Button variant="contained" size="small">
                                            Войти
                                        </Button>
                                    </NavLink>
                                    <NavLink className={styles.signUpButton} to="/signup">
                                        <Button variant="contained" size="small">
                                            Зарегистрироваться
                                        </Button>
                                    </NavLink>
                                </div>
                                :
                                <></>
                        :
                        <></>
                    }
                    <Popper 
                        className={styles.menuPopper}
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

function User({ user, onClick }) {
    const handleClick = (evt) => onClick(evt);

    return (
        <div className={styles.userContainer} onClick={handleClick}>
            <span className={styles.login}>
                {user.login}
            </span>
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

