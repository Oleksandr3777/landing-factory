# CLAUDE.md — Landing Factory
> Читай цей файл ПЕРШИМ перед будь-якою задачею.

## Бізнес-контекст
Машина для тестування товарів через лендінги в Україні.
- Модель: власний склад → лендінг → реклама (Meta/TikTok/Google) → замовлення в Telegram
- Оплата: LiqPay / WayForPay (є ФОП + еквайринг)
- Доставка: Нова Пошта накладеним платежем або онлайн-оплата
- Ціль: новий лендінг за 1-2 години, 3-5 тестів на тиждень

## Технічний стек
- **Фреймворк:** Astro 4.x — `output: 'static'` ЗАВЖДИ
- **Стилі:** Tailwind CSS 3.x
- **Сервер:** Ukrainian.net, тариф Бізнес 6G, shared Linux
- **Деплой:** FTP у /public_html/[назва-товару]/
- **Форми:** Cloudflare Worker → Telegram Bot API
- **Аналітика:** Meta Pixel + TikTok Pixel + Google Tag Manager
- **Еквайринг:** LiqPay або WayForPay

## Структура репозиторію
```
landing-factory/
├── CLAUDE.md
├── docs/
│   ├── setup.md
│   ├── new-product.md
│   └── deploy.md
├── templates/base/          ← базовий шаблон, НЕ чіпати напряму
├── products/
│   ├── korsety/             ← коригуюча білизна
│   │   ├── config.ts
│   │   └── variants/v1/    ← v2, v3... для A/B тестів
│   └── markery/             ← маркери для підписів
├── scripts/
│   ├── new-product.sh
│   ├── deploy.sh
│   └── worker/form-handler.js
└── themes/                  ← збережені колірні схеми
```

## Скіли (що вмію робити)

### create-landing
**Тригер:** "створи лендінг для [товар]"
1. Копіюю `templates/base/` → `products/[назва]/variants/v1/`
2. Заповнюю `config.ts` даними товару
3. Адаптую компоненти під специфіку
4. `npm run build` → перевіряю
5. Кажу точний шлях для заливки на Ukrainian

### create-variant
**Тригер:** "створи варіант B" / "інший дизайн" / "інші кольори"
1. Копіюю `variants/v1/` → `variants/v2/`
2. Міняю лише те що просили
3. Зберігаю оригінал незміненим
4. Документую різницю в `variants/README.md`

### add-product
**Тригер:** "додай товар [назва]"
1. `bash scripts/new-product.sh [назва]`
2. Заповнюю config.ts
3. Адаптую шаблон

### deploy
**Тригер:** "задеплой" / "залий на сервер"
1. `npm run build`
2. Перевіряю `dist/index.html`
3. Кажу точний шлях: "Залий `dist/` → Ukrainian FTP → `/public_html/[назва]/`"

### new-color-theme
**Тригер:** "інші кольори" / "темна версія"
1. Міняю `tailwind.config.mjs` — `colors.primary/accent/bg`
2. Перебілдую
3. Зберігаю тему в `themes/[назва].ts`

### optimize-cr
**Тригер:** "покращ конверсію" / "CR низький"
1. Hero: чіткий оффер + CTA вище фолду?
2. Форма: максимум 3 поля?
3. Соцдокази: відгуки з фото є?
4. Швидкість: розмір бандлу?
5. Пропоную конкретні правки

## Правила коду

### Завжди
- `output: 'static'` в astro.config.mjs
- Mobile-first стилі
- Зображення через `<Image>` Astro
- Форма → Cloudflare Worker URL з config.ts
- Всі тексти/ціни/кольори лише через config.ts

### Ніколи
- Не SSR — shared-хостинг без Node.js
- Не важкі JS-бібліотеки (jQuery, lodash)
- Не чутливі дані в коді (тільки .env)
- Не більше 3 шрифтів

## config.ts — обов'язкова структура
```typescript
export const config = {
  product: {
    name: "",
    tagline: "",
    price: 0,
    oldPrice: 0,
    currency: "грн",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: [],
  },
  upsell: {
    enabled: true,
    product: "",
    price: 0,
    discount: "−50% при замовленні разом",
  },
  form: {
    workerUrl: "https://YOUR_WORKER.workers.dev/submit",
    fields: ["name", "phone", "size"],
  },
  pixels: {
    metaPixelId: "",
    tiktokPixelId: "",
    gtmId: "",
  },
  delivery: {
    carrier: "Нова Пошта",
    cod: true,
    freeFrom: 2000,
  },
  legal: {
    fop: "ФОП Іваненко І.І.",
    ofertaUrl: "/oferta",
    returns: "14 днів згідно ЗУ",
  },
  seo: {
    title: "",
    description: "",
    ogImage: "/og.jpg",
  },
}
```

## Обов'язкові блоки лендінгу (по порядку)
1. **Hero** — заголовок + CTA + фото. Все вище фолду на iPhone.
2. **Проблема** — 3-4 болі аудиторії
3. **Рішення** — як товар вирішує
4. **Переваги** — 4-6 іконок
5. **Фото/відео** — галерея товару
6. **Розміри** — таблиця (для одягу обов'язково)
7. **Відгуки** — мінімум 5, з ім'ям або фото
8. **Upsell** — допродаж
9. **FAQ** — 5-7 питань
10. **Форма** — ім'я + телефон + розмір
11. **Футер** — ФОП, оферта, повернення

## Дизайн-система

### Базові кольори (для жіночих товарів)
```
primary: #E91E8C   (рожевий)
accent:  #FF6B35   (помаранчевий CTA)
dark:    #1A1A2E
light:   #F8F9FA
```

### Типографіка
- Заголовки: Montserrat 700
- Текст: Inter 400/500
- h1 мобільний: 28px / десктоп: 48px

### CTA кнопки
- Колір accent, висота мінімум 48px
- Текст: дієслово + результат ("Замовити зі знижкою")
- Поруч таймер або лічильник залишку

## Конверсійний чеклист
- [ ] CTA видна без скролу на iPhone 12
- [ ] Форма максимум 3 поля
- [ ] Є таймер або "залишилось X штук"
- [ ] Стара ціна закреслена поруч з новою
- [ ] Мінімум 5 відгуків з ім'ям/фото
- [ ] Логотипи НП + LiqPay (довіра)
- [ ] PageSpeed > 85 мобільний
- [ ] Мікророзмітка schema.org Product

## Чеклист перед запуском реклами
- [ ] Сайт відкривається на мобільному
- [ ] Форма → Telegram працює
- [ ] Meta Pixel спрацьовує
- [ ] TikTok Pixel спрацьовує
- [ ] SSL активний (https://)
- [ ] Сторінка /oferta існує
- [ ] Зображення всі завантажились
- [ ] PageSpeed Insights > 85

## Команди
```bash
# Новий товар
bash scripts/new-product.sh назва-товару

# Розробка локально
cd products/korsety/variants/v1 && npm run dev

# Білд для деплою
npm run build
# → dist/ готова для FTP на Ukrainian

# Перевірка розміру
du -sh dist/

# Новий A/B варіант
bash scripts/create-variant.sh korsety v2
```
