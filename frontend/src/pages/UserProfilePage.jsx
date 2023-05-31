import React, { useCallback, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { Helmet } from "react-helmet";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import { useStore } from "../hooks";
import styles from "./UserProfilePage.module.css";
import PageLayout from "../layouts/PageLayout";
import GameCard from "../components/GameCard";
import Competence from "../components/Competence";
import { GamesStore } from "../models/game";
import { Button } from "@mui/material";
import PhotoProfile from "../components/images/BigPhotoProfile.png";
import NavMainButton from "../components/NavMainButton";
import NavButton from "../components/NavButton";
import Header from "../components/Header";

function UserProfilePage({ history }) {

    const { userId } = useParams();
    const { auth } = useStore();

    const user = useLocalObservable(() => User.create({ id: userId }));
    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);
    const gamesStore = useLocalObservable(() => GamesStore.create());
    useEffect(() => { gamesStore.loadForUser(userId).catch(err => console.error(err)); }, []);
   

    const renderGames = useCallback((games) => (
        <div className={styles.games}>
            <h2 className={styles.gameTitle}>Загруженные игры</h2>
            <div className={styles.games__list}>
                {games.map((g, i) =>
                    (<GameCard key={i} game={g} />)
                )}
            </div>
        </div>
    ), []);

    

    return (
        <>
            <Helmet>
                <title>
                    {user.loaded ? `${user.login} | Профиль` : "Загрузка"}
                </title>
            </Helmet>
            <Header/>
            {
                user.loaded && (
                    <PageLayout>
                        <h2 className={styles.personTitle}>{`Аккаунт пользователя ${user.login}`}
                        </h2>
                        <div className={styles.personInfoLabel}>
                            {
                                1 === 0 && auth.user && auth.user.isAdmin() && (
                                    <div className={styles.deleteButtonWrapper}>
                                        <Button onClick={async () => {
                                            if (await user.delete())
                                                history.push("/");
                                        }}>Удалить</Button>
                                    </div>
                                )
                            }                            
                        </div>
                        <div className={styles.GridBox}> 

                            <div>
                                <img src={user.avatar} className={styles.avatarImage} />
                            </div>    
                            <div>
                                <div className={styles.textLogin}>Login: {user.login}</div>
                                <div className={styles.textUsual}>Email: {user.email}</div>
                                <div className={styles.textUsual}>ФИО: {user.surname == null ? "" : user.surname} {user.name == null ? "" : user.name} {user.patronymic == null ? "" : user.patronymic}</div>
                                
                                {auth.authenticated &&  (
                                    <div className={styles.btn}>
                                        <p>
                                            <NavButton  text={"Редактировать"}></NavButton>
                                        </p>
                                        <p>
                                            <NavButton  text={"Сменить пароль"}></NavButton>
                                        </p>
                                    </div>               
                                )}     
                            </div>
                        </div>
                        <div>
                            {gamesStore.array().length > 0 && renderGames(gamesStore.array())}                            
                        </div>
                    </PageLayout>
                )
            }

        </>
    );
}

export default observer(UserProfilePage);
