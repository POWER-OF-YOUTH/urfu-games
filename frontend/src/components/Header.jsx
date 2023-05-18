import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Slide, Popper, Button, MenuList, MenuItem, ListItemIcon, ClickAwayListener, Menu } from "@mui/material";
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
                <header>
                    <Logo />
                    {auth.authenticated
                        ? 
                        // <NavMainButton text={'Стать'}></NavMainButton> :<></>
                        <NavButton  text={'Стать разработчиком'}></NavButton> :<></>
                        // <Button  className={styles.developerButton} variant="outlined" style={{textTransform: 'none', color: 'black', fontWeight: 'bold', borderRadius: '8px', border: '2px solid rgba(4, 99, 234, 1)'}}>Стать разработчиком</Button>: <></>
                    }  
                    <Button id="basic-button" className={styles.popupButton}>
                        <img src={buttonBells} />
                    </Button>                   
                    {auth.authenticated
                        ? showUser && <User user={auth.user} onClick={handleUserClick}/>
                        : showAuthButtons && (
                            <div className={styles.authButtonsContainer}>
                                <NavLink
                                    className={styles.signInLink}
                                    to={{
                                        pathname: "/signin",
                                        state: { redirectTo: location.pathname },
                                    }}
                                >
                                    <SignInButton variant="contained" size="small" style={{ textTransform: "none" }}>
                                        Вход и регистрация
                                    </SignInButton>
                                </NavLink>
                            </div>
                        )}                      
                    <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        className={styles.menuButton}
                    >
                        <img src={panelButton} />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem onClick={handleClose}>Настройки</MenuItem>
                        <MenuItem onClick={handleClose}>Язык: Русский</MenuItem>
                        <MenuItem onClick={handleClose}>Тема: светлая</MenuItem>
                        <MenuItem onClick={handleClose}>Выйти</MenuItem>
                    </Menu>

                    <Popper
                        open={isMenuOpen}
                        anchorEl={menuAnchorElement}
                        onClose={handleMenuClose}
                        menulistprops={{ "aria-labelledby": "basic-button" }}
                        placement="bottom-end"
                        transition
                    >
                        {({ TransitionProps }) => (
                            <Slide {...TransitionProps}>
                                <div className={styles.menuListContainer}>
                                    <ClickAwayListener onClickAway={handleMenuClose}>
                                        <MenuList>
                                            <MenuItem component={Link} to={"/users/" + auth.user.id}>
                                                <ListItemIcon>
                                                    <UserProfileIcon />
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
                        )}
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
            <Link to="/" className={styles.leftSideLogo}>
                {isMobile ? "U" : "UrFU"}
            </Link>
            <Link to="/" className={styles.rightSideLogo}>
                {isMobile ? "G" : "Games"}
            </Link>
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
        <div className={styles.userContainer} onClick={handleClick}>
            <Login className={`${styles.login}`}>{user.login}</Login>
            <div className={styles.avatar}>
                <img alt="avatar" src={user.avatar} />
            </div>
        </div>
    );
}

export default observer(Header);
