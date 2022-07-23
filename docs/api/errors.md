# ⛔ Ошибки

При неправильной работе с API может возникнуть ошибка одного из четырех видов:
- Ошибка валидации.
- Ошибка логики.
- Ошибка доступа.
- Ошибка неопределенного типа.

## Ошибка валидации

**Описание**: Ошибка валидации возникает, когда переданные пользователем данные не удовлетворяют критериям валидации.

Поле|Тип|Описание
-|-|-
param|string|Имя параметра запроса в котором была допущена ошибка
location|string|В какой части запроса была допущена ошибка. Может принимать значения *body*, *query* и др.
detail|string|Текстовое описание ошибки
type|string|Тип ошибки. Имеет значние *validation*
instance|string|URL адрес, при обращении к которому произошла ошибка

## Ошибка доступа

**Описание**: Ошибка доступа возникает, если пользователь пытается выполнить запрос, используя токен, у которого истек срок действия; или у него недостаточно прав для выполнения указанного запроса.

Поле|Тип|Описание
-|-|-
detail|string|Текстовое описание ошибки
type|string|Тип ошибки. Имеет значние *access*
instance|string|URL адрес, при обращении к которому произошла ошибка

## Ошибка логики

**Описание**: Ошибка логики возникает, если нарушается логика работы системы, например, пользователь пытается создать аккаунт с логином, который уже зарегистрирован, или обратиться к несуществующему объекту.


Поле|Тип|Описание
-|-|-
detail|string|Текстовое описание ошибки
type|string|Тип ошибки. Имеет значние *logic*
instance|string|URL адрес, при обращении к которому произошла ошибка

## Ошибка неопределенного типа

**Описание**: Возникает при внутреннем сбое в системе.

Поле|Тип|Описание
-|-|-
detail|string|Текстовое описание ошибки
type|string|Тип ошибки. Имеет значние *unexpected*
instance|string|URL адрес, при обращении к которому произошла ошибка