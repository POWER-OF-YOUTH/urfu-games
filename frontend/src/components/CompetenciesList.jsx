import React, { useEffect } from "react";

import Block from "./Block";

import styles from "./CompetenciesList.module.css";
import IconAccount from "../components/svg/IconAccount.svg";
import IconGames from "../components/svg/IconGames.svg";
import IconHome from "../components/svg/IconHome.svg";
import IconGroup from "../components/svg/IconGroup.svg";
import IconSettings from "../components/svg/IconSettings.svg";
import IconVerification from "../components/svg/IconVerification.svg";
import { useStore } from "../hooks";
import { GamesStore } from "../models/game";
import { CompetenciesStore } from "../models/competence";
import { observer, useLocalObservable } from "mobx-react-lite";


function CompetenciesList({ className = "", children }) {
    const { auth }  = useStore();
    const games = useLocalObservable(() => GamesStore.create());
    const competencies = useLocalObservable(() => CompetenciesStore.create());

    useEffect(() => {
        games.load().catch(err => console.error(err));
        competencies.load().catch(err => console.error(err));
    }, []);

    return (
        <Block className={`${styles.competencies} ${className}`}>
            <div className={styles.competenciesContainer}>
                <div className={styles.coverBlock}>
                    <a className={styles.coverlink} href={"/"}><img src={IconHome} className={styles.cover}></img>   
                        <span className={styles.coverText}>Главная</span>
                    </a>   
                </div>
                {auth.authenticated &&(
                    <div className={styles.coverBlock}>
                        <a className={styles.coverlink} href={"/games/unpublicated"}><img src={IconGames} className={styles.cover}></img>
                            <span className={styles.coverText}>Библиотека</span>
                        </a>      
                    </div>                
                )}               
                {auth.authenticated && (                    
                    <div className={styles.coverBlock}>
                        <a className={styles.coverlink} href={"/users/" + auth.user.id}><img src={IconAccount} className={styles.cover}></img>  
                            <span className={styles.coverText}>Акаунт</span>
                        </a>   
                    </div>          
                )}

                {auth.authenticated && (
                    <div className={styles.coverBlock}>
                        <a className={styles.coverlink} href={"/games/unpublicated"}><img src={IconSettings} className={styles.cover}></img>
                            <span className={styles.coverText}>Мои проекты</span>
                        </a>                     
                    </div>        
                )}
                {auth.authenticated && auth.user.isModerator() && (
                    <div className={styles.coverBlock}>
                        <a className={styles.coverlink} href={"/games/unpublicated"}><img src={IconVerification} className={styles.cover}></img>
                            <span className={styles.coverText}>На  проверке</span>
                        </a>      
                    </div>                
                )}
                {auth.authenticated && (
                    <div className={styles.coverBlock}>
                        <a className={styles.coverlink} href={"/games/unpublicated"}><img src={IconGroup} className={styles.cover}></img>
                            <span className={styles.coverText}>Группы</span>
                        </a>      
                    </div>                
                )}
                {/* {children} */}
            </div>
        </Block>
    );
}

export default observer(CompetenciesList);
