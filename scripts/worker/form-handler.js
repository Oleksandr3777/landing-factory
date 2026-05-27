/**
 * Cloudflare Worker — обробка форм замовлення
 * Деплой: wrangler deploy (або через dashboard.cloudflare.com)
 *
 * Environment Variables (встановити в Cloudflare Dashboard):
 *   TELEGRAM_BOT_TOKEN — токен бота від @BotFather
 *   TELEGRAM_CHAT_ID   — ID чату або @назва каналу
 */

export default {
  async fetch(request, env) {
    // CORS — дозволяємо запити з будь-якого домену
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, phone, size, color, product, source, upsell } = data;

      // Валідація обов'язкових полів
      if (!name || !phone) {
        return new Response(
          JSON.stringify({ ok: false, error: "Вкажіть ім'я та телефон" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Форматування повідомлення для Telegram
      const upsellLine = upsell ? `\n➕ *Допродаж:* ${upsell}` : "";
      const sizeLine = size ? `\n📐 *Розмір:* ${size}` : "";
      const colorLine = color ? `\n🎨 *Колір:* ${color}` : "";
      const sourceLine = source ? `\n🌐 *Джерело:* ${source}` : "";

      const message = `🛍 *НОВЕ ЗАМОВЛЕННЯ*
━━━━━━━━━━━━━━━━
📦 *Товар:* ${product || "Не вказано"}${sizeLine}${colorLine}
━━━━━━━━━━━━━━━━
👤 *Ім'я:* ${name}
📞 *Телефон:* ${phone}${upsellLine}${sourceLine}
━━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}`;

      // Відправка в Telegram
      const tgResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        }
      );

      if (!tgResponse.ok) {
        throw new Error("Telegram API error");
      }

      return new Response(
        JSON.stringify({ ok: true, message: "Замовлення прийнято!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ ok: false, error: "Помилка сервера" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
