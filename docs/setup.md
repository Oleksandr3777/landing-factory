# Налаштування з нуля — покрокова інструкція

## Крок 1 — Встановити інструменти на комп'ютер

```bash
# 1. Node.js (якщо немає) — завантажити з nodejs.org, версія 18+
node --version   # має показати v18 або вище

# 2. Claude Code — встановити з claude.ai/code
# 3. Git — завантажити з git-scm.com (якщо немає)
```

## Крок 2 — Клонувати проєкт

```bash
git clone https://github.com/ВАШ_АКАУНТ/landing-factory.git
cd landing-factory
```

Або просто розпакуйте ZIP-архів якщо без Git.

## Крок 3 — Налаштувати Cloudflare Worker (один раз назавжди)

### 3.1 Створити Telegram-бота
1. Відкрити Telegram → знайти @BotFather
2. Надіслати `/newbot`
3. Придумати ім'я і username бота
4. Скопіювати **токен** (виглядає як `1234567890:AAFxxx...`)

### 3.2 Отримати Chat ID
1. Створити групу або канал в Telegram
2. Додати вашого бота туди
3. Відправити будь-яке повідомлення в групу
4. Відкрити в браузері: `https://api.telegram.org/botВАШ_ТОКЕН/getUpdates`
5. Знайти `"chat":{"id":` — скопіювати число (може бути від'ємним для груп)

### 3.3 Задеплоїти Worker на Cloudflare
1. Зареєструватись на cloudflare.com (безкоштовно)
2. Зайти в Workers & Pages → Create Worker
3. Скопіювати код з `scripts/worker/form-handler.js`
4. Натиснути Deploy
5. В Settings → Variables додати:
   - `TELEGRAM_BOT_TOKEN` = ваш токен
   - `TELEGRAM_CHAT_ID` = ваш chat ID
6. Скопіювати URL воркера (виглядає як `https://form-handler.YOUR.workers.dev`)

### 3.4 Прописати URL в config.ts
```typescript
form: {
  workerUrl: "https://form-handler.YOUR.workers.dev/submit",
}
```

## Крок 4 — Перший лендінг (коригуюча білизна)

```bash
# Встановити залежності базового шаблону
cd templates/base
npm install

# Повернутись і створити перший товар
cd ../..
bash scripts/new-product.sh korsety
```

Заповнити `products/korsety/config.ts`:
```typescript
product: {
  name: "Коригуюче боді SlimFit",
  tagline: "Мінус 2 розміри з першого вдягання",
  price: 890,
  oldPrice: 1490,
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
}
```

```bash
# Запустити локально для перегляду
cd products/korsety/variants/v1
npm run dev
# Відкрити http://localhost:4321
```

## Крок 5 — Деплой на Ukrainian

### 5.1 Зібрати сайт
```bash
cd products/korsety/variants/v1
npm run build
# Папка dist/ готова
```

### 5.2 Залити через FTP
**Варіант A — через файловий менеджер панелі Ukrainian:**
1. Зайти в панель Ukrainian → Файловий менеджер
2. Перейти в `/public_html/`
3. Створити папку `korsety`
4. Завантажити вміст папки `dist/` туди

**Варіант B — через FTP-клієнт (FileZilla):**
```
Хост: ftp.ukrainian.com.ua (або ваш домен)
Логін: xx603827 (ваш акаунт)
Пароль: (з панелі Ukrainian)
Порт: 21
```
Залити `dist/` → `/public_html/korsety/`

### 5.3 Прив'язати домен
1. Купити домен korsety.ua (або будь-який) в Ukrainian або в ua.domains
2. В панелі Ukrainian → Сайти → Додати домен
3. Вказати шлях `/public_html/korsety`
4. Підключити SSL (безкоштовний Let's Encrypt — одна кнопка)

## Крок 6 — Підключити пікселі

В `products/korsety/config.ts`:
```typescript
pixels: {
  metaPixelId: "1234567890123456",   // з Meta Business Manager
  tiktokPixelId: "CXXXXXXXXXXXXX",   // з TikTok Business
  gtmId: "GTM-XXXXXXX",             // з Google Tag Manager
}
```

## Крок 7 — Запустити A/B тест

```bash
# Створити варіант з іншими кольорами
bash scripts/new-product.sh korsety v2
# Змінити кольори в v2/tailwind.config.mjs
# Залити на /public_html/korsety-v2/
# Прив'язати домен korsety2.ua або тестувати через /korsety-v2
```

## Структура Ukrainian після запуску

```
/public_html/
├── korsety/          → korsety.ua    (варіант A — рожевий)
├── korsety-v2/       → korsety2.ua   (варіант B — чорний)
├── markery/          → markery.ua    (наступний товар)
└── oferta/           → спільна оферта для всіх товарів
```

## Часті питання

**Q: Як оновити текст на сайті?**
A: Змінити в config.ts → `npm run build` → залити оновлену папку `dist/` на Ukrainian (перезаписати)

**Q: Як перевірити що форма працює?**
A: Заповнити форму на сайті → має прийти повідомлення в Telegram протягом 5 секунд

**Q: Як додати новий товар швидко?**
A: `bash scripts/new-product.sh назва` → заповнити config.ts → build → деплой

**Q: Де зберігати фото товарів?**
A: В папці `products/[назва]/variants/v1/public/images/` — Astro автоматично оптимізує
