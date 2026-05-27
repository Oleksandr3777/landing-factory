// config.ts — налаштування товару "Коригуюча білизна"
// Змінюй тільки цей файл для оновлення контенту сайту

export const config = {
  product: {
    name: "Коригуюче боді SlimFit",
    tagline: "Мінус 2 розміри з першого вдягання",
    price: 890,
    oldPrice: 1490,
    currency: "грн",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Чорний", "Бежевий", "Білий"],
  },
  upsell: {
    enabled: true,
    product: "Коригуючі трусики SlimFit",
    price: 390,
    discount: "−50% при замовленні разом з боді",
  },
  form: {
    // Замінити після деплою Worker на Cloudflare
    workerUrl: "https://form-handler.YOUR_NAME.workers.dev/submit",
    fields: ["name", "phone", "size"],
  },
  pixels: {
    metaPixelId: "",      // Вставити з Meta Business Manager
    tiktokPixelId: "",    // Вставити з TikTok Business
    gtmId: "",            // Вставити з Google Tag Manager
  },
  delivery: {
    carrier: "Нова Пошта",
    cod: true,
    freeFrom: 2000,
  },
  legal: {
    fop: "ФОП Іваненко І.І., ЄДРПОУ 1234567890",
    ofertaUrl: "/oferta",
    returns: "14 днів згідно ЗУ «Про захист прав споживачів»",
  },
  seo: {
    title: "Коригуюче боді SlimFit — мінус 2 розміри | Доставка НП",
    description: "Коригуюче боді для жінок розміри S-3XL. Миттєвий ефект стрункості. Доставка Новою Поштою по всій Україні. Оплата при отриманні.",
    ogImage: "/images/og.jpg",
  },
}
