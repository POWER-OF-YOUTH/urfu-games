# Методы поиска

## GET /search/users

**Описание**: Метод, позволяющий искать пользователей по логину.

### Параметры запроса

Название|Описание|Валидация|Обязательный|Значение по умолчанию
-|-|-|-|-
q|Часть логина искомого пользователя|Соответствует шаблону: ^[a-zA-Z0-9 ]\*$|✔️|—
start|Начальный индекс|Положительное число|❌|0
count|Длина возвращаемого массива пользователей|Находится в интервале от 0 до 100|❌|10
sort|Поле по которому производится сортировка|Может принимать следующие значения: *name*, *login*, *email* или *createdAt*|❌|*createdAt*
order|Режим сортировки: по возрастанию или по убыванию|Является *ascending* или *descending*|❌|*ascending*

### Примеры использования

Запрос:
```url
GET https://api.urfugames.ru/search/users?q=a
```

Ответ:
```json
[
    {
        "id": "beb8c2a0-0868-46ee-89fd-04d317d5b5db",
        "login": "admin",
        "email": "admin@urfugames.ru",
        "role": 0,
        "avatar": "https://i.ibb.co/C9VKrMC/default-avatar.png",
        "createdAt": "2022-04-14T11:19:09.004Z"
    },
    {
        "id": "a53c1af3-cb0f-4886-bf1d-4c89e91efc3d",
        "login": "aceki",
        "email": "aceki320@gmail.com",
        "role": 0,
        "avatar": "https://i.ibb.co/C9VKrMC/default-avatar.png"
        "createdAt": "2022-04-14T11:19:09.004Z"
    }
]
```

## GET /search/games

**Описание**: Метод, позволяющий искать игры по названию.

### Параметры запроса

Название|Описание|Валидация|Обязательный|Значение по умолчанию
-|-|-|-|-
q|Часть названия искомой игры|Соответствует шаблону: ^[a-zA-Zа-я0-9 ]\*$|✔️|—
start|Начальный индекс|Положительное число|❌|0
count|Длина возвращаемого массива игр|Находится в интервале от 0 до 100|❌|10
sort|Поле по которому производится сортировка|Может принимать следующие значения: *name*, *rating* или *createdAt*|❌|*createdAt*
order|Режим сортировки: по возрастанию или по убыванию|Является *ascending* или *descending*|❌|*ascending*

### Примеры использования

Запрос:
```url
GET https://api.urfugames.ru/search/games?q=test
```

Ответ:
```json
[
    {
        "id": "3d9ba3e4-0384-4890-b832-4c2f7b51bff5",
        "image": "https://i.ibb.co/tYBmRYh/maxresdefault.jpg",
        "name": "Test",
        "rating": 0,
        "author": {
            "id": "dad9ee6b-3d87-41ed-ae1a-bbd0b1705d20",
            "login": "admin",
            "email": "admin@urfugames.ru",
            "role": 1,
            "name": null,
            "surname": null,
            "patronymic": null,
            "avatar": "https://i.ibb.co/C9VKrMC/default-avatar.png"
        },
        "createdAt": "2022-04-13T09:41:53.756Z",
        "uploaded": false
    }
]
```

