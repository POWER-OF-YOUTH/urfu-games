# 🔑 Аутентификация/авторизация

## POST /auth/signup

**Описание**: Метод, который используется для регистрации пользователей в системе.

### Тело запроса

Название|Тип|Описание|Валидация|Обязательный|Значение по умолчанию
-|-|-|-|-|-
login|string|Логин пользователя|Удовлетворяет шаблону: *^[0-9A-Za-z]+$*|✔️|—
email|string|Электронный почта пользователя|Является дествительной|✔️|—
password|string|Пароль пользователя|Удовлетворяет шаблону: *^[0-9a-zA-Z_\\-@#%., ]+$* и длина не менее 6 символов|✔️|—

### Примеры использования

Запрос
```http
POST /auth/signup

{
    "login": "example",
    "email": "example@example.ru",
    "password": "example1234"
}
```

Ответ:
```json
{}
```

## POST /auth/signin

**Описание**: Позволяет зарегистрированному пользователю получить JWT токен.

### Тело запроса

Название|Тип|Описание|Валидация|Обязательный|Значение по умолчанию
-|-|-|-|-|-
login|string|Логин пользователя|Удовлетворяет шаблону: *^[0-9A-Za-z]+$*|✔️|—
password|string|Пароль пользователя|Удовлетворяет шаблону: *^[0-9a-zA-Z_\\-@#%., ]+$* и длина не менее 6 символов|✔️|—

### Примеры использования

Запрос:
```http
POST /auth/signin

{
    "login": "example",
    "password": "example1234"
}
```

Ответ:
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

## POST /auth/check

**Описание**: Используется для проверки действительности токена. Если токен действительный, возвращает данные пользователя.

### Заголовки запроса

Название|Тип|Описание|Обязательный|Значение по умолчанию
-|-|-|-|-
Authorization|string|JWT токен пользователя|✔️|—

### Примеры использования

Запрос:
```http
POST /auth/check

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Ответ:
```json
{
    "id": "dad9ee6b-3d87-41ed-ae1a-bbd0b1705d20",
    "login": "example",
    "email": "example@example.ru",
    "role": 0,
    "name": null,
    "surname": null,
    "patronymic": null,
    "avatar": "https://i.ibb.co/C9VKrMC/default-avatar.png"
}
```

