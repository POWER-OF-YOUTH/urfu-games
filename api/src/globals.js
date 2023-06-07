/**
 * @file Глобальные переменные необходимые для работы сервера.
 */

/**
 * Функция, которая вызывает исключение, если переменная
 * окружения с именем `name` не определена.
 * @param name имя переменной окружения.
 */
function checkEnvVariableDefined(name) {
    if (process.env[name] === undefined)
        throw new Error(`You should define \`${name}\` environment variable.`);
}

checkEnvVariableDefined("JWT_SECRET");
checkEnvVariableDefined("USER_PWD_SALT");
checkEnvVariableDefined("ADMIN_PASSWORD");
checkEnvVariableDefined("DATABASE_URI");

/** API URI. */
export const API_URI = process.env.API_URI;
/** FILES URI. */
export const FILES_URI = process.env.FILES_URI;
/** Адрес, к которому будет прикреплен сервер. */
export const HOSTNAME = process.env.HOSTNAME ?? "0.0.0.0";
/** Порт, который будет использоваться сервером. */
export const PORT = Number(process.env.PORT ?? 3000);
/** Логин администратора. */
export const ADMIN_LOGIN = "admin";
/** Адрес электронной почты администратора. */
export const ADMIN_EMAIL = "admin@trajector.ru";
/** Пароль администратора. */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
/** Секрет, который будет использоваться для подписи JWT. */
export const JWT_SECRET = process.env.JWT_SECRET;
/** Соль, которая будет использоваться при хешировании паролей пользователей. */
export const USER_PWD_SALT = process.env.USER_PWD_SALT;
/** URI базы данных PostgreSQL. */
export const DATABASE_URI = process.env.DATABASE_URI;
