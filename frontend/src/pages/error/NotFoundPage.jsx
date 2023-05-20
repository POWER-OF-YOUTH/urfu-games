import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavMainButton from "../../components/NavMainButton.jsx";

// import buttonBells from "./components/svg/buttonBells.svg";
// frontend\src\components\NavButton.module.css
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <>
            <main className={styles.content}>
                <p className={styles.errorCode}>Ошибка 404</p>
                <p className={styles.errorMessage}>Такой страницы не существует</p>
                {/* <p className={styles.errorMessage}>Запрашиваемая страница не найдена</p> */}
                <NavMainButton text={'Вернуться на главную'} href={"/"}  > </NavMainButton> <></>
            </main>
        </>
    );
}

export default NotFoundPage;
