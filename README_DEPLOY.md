# 🚀 Деплой игры "Болтун" на Netlify

## Быстрый старт

### 1. Регистрация на Netlify
1. Перейди на https://www.netlify.com/
2. Нажми "Sign up" (Зарегистрироваться)
3. Выбери "Sign up with GitHub" или "Sign up with Email"
4. Подтверди email если нужно

### 2. Деплой через Drag & Drop (самый простой способ)
1. Войди в Netlify
2. На главной странице найди область "Want to deploy a new site without connecting to Git?"
3. Перетащи всю папку проекта `PC_Brain_Cat` в эту область
4. Netlify автоматически загрузит и опубликует сайт
5. Получишь ссылку вида `https://random-name-123456.netlify.app`

### 3. Деплой через GitHub (рекомендуется для автообновлений)
1. Создай репозиторий на GitHub
2. Загрузи туда все файлы проекта
3. В Netlify нажми "Add new site" → "Import an existing project"
4. Выбери GitHub и авторизуйся
5. Выбери свой репозиторий
6. Настройки оставь по умолчанию (Build command: пусто, Publish directory: .)
7. Нажми "Deploy site"

### 4. Настройка кастомного домена (опционально)
1. В настройках сайта на Netlify найди "Domain settings"
2. Нажми "Add custom domain"
3. Следуй инструкциям

## Важно для микрофона
- Netlify автоматически дает HTTPS
- Микрофон работает только через HTTPS
- После деплоя можешь тестировать на телефоне

## Локальное тестирование
Для локального запуска (без микрофона):
```bash
npm start
```
Или просто открой `index.html` в браузере.

## Структура проекта
```
PC_Brain_Cat/
├── index.html          # Главная страница
├── styles.css          # Стили
├── app.js              # Логика игры
├── netlify.toml        # Конфигурация Netlify
├── package.json        # Информация о проекте
└── README_DEPLOY.md    # Эта инструкция
```

## Обновление сайта
- **Drag & Drop**: просто перетащи папку снова
- **GitHub**: сделай commit и push - Netlify обновит автоматически
