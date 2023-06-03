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
import styles from "./Header.module.css";

/*  
 * @param {{ variant: "standard" | "hidebuttons" | "hideall" }}
 */
function Header({ variant = "standard", onChange }) {
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
                    {/* <Autocomplete className={styles.search}                        
                        id="free-solo-demo"
                        freeSolo
                        options={top100Films}
                        sx={{ width: 490 }}
                        renderInput={(params) => <TextField {...params} variant="standard" sx={{ height: '34px'}} label="калич"/>}
                        // renderInput={(params) => <TextField sx={{ }} {...params} label="Поиск" />}
                    /> */}
                    <div  className={styles.form}>
                        <div className={styles.search}>
                            <form className={styles.searchForm}>
                                <input  
                                    type="text"
                                    placeholder="Поиск"
                                    className={styles.searchInput}
                                    onChange={onChange}
                                />
                                {/* <ul className={styles.autocomplete}>
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                    <li>Item</li>
                                </ul> */}
                            </form>
                        </div> 
                    </div>
                    <div className={styles.navButton}>             
                        <NavMainButton text={'Найти'} href={"/games"} className={styles.test}> </NavMainButton> <></>
                        {
                            auth.authenticated ? 
                                <NavButton text={'Стать разработчиком'} href={"/games/new "}  className={styles.createrButton}> </NavButton>:<></>
                                // <NavMainButton text={"Стать разработчиком"}></NavMainButton>:<></>
                            // <Button  className={styles.developerButton} variant="outlined" style={{textTransform: 'none', color: 'black', fontWeight: 'bold', borderRadius: '8px', border: '2px solid rgba(4, 99, 234, 1)'}}>Стать разработчиком</Button>: <></>
                        }
                        {auth.authenticated
                            ? showUser && <User user={auth.user} onClick={handleUserClick} />
                            : showAuthButtons && (
                                <div className={styles.authButtonsContainer}>
                                    <NavLink
                                        className={styles.signInLink}
                                        to={{
                                            pathname: "/signin",
                                            state: { redirectTo: location.pathname },
                                        }}
                                    >                                    
                                    </NavLink>     
                                    <NavMainButton 
                                        text={'Вход и регистрация'}  href={"/signin"}  className={styles.signUpButton} >        
                                    </NavMainButton>                          
                                </div>
                            )}

                        <Button id="basic-button" className={styles.popupButton}>
                            <img src={buttonBells} />
                        </Button>   
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
                            <MenuItem onClick={handleLogoutClick}>Выйти</MenuItem>
                        </Menu>
                    </div>
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

export default observer(Header);
