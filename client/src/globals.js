/**
 * @file Глобальные настройки.
 */

/** API URI. */
export const API_URI = process.env.API_URI;
/** Токен пользователя. */
export const ACCESS_TOKEN = localStorage.getItem("access_token");
/** Идентификатор счетчика Яндекс.Метрики. */
export const YM_ID = process.env.YM_ID;
