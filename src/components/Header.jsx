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

function Header({ className = "" }) {
    const rootStore = React.useContext(RootStoreContext);
    const authStore = rootStore.authStore;
    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
    const [isMobile, setIsMobile] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logo}>
                    { isMobile ? "UG" : "UrFU Games" }
                </Link>
            </div>
            {authStore.authenticated ? 
                <>
                    <User user={authStore.user} onClick={handleUserClick} /> 
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
                </>
                : 
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
            }
        </div>
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

