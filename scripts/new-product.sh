#!/bin/bash
# Створення нового товару або варіанту з шаблону
# Використання: bash new-product.sh назва-товару [v2|v3...]

PRODUCT=$1
VARIANT=${2:-v1}
TEMPLATE="../../templates/base"
TARGET="products/$PRODUCT/variants/$VARIANT"

if [ -z "$PRODUCT" ]; then
  echo "Помилка: вкажи назву товару"
  echo "Приклад: bash new-product.sh korsety"
  echo "Приклад варіанту: bash new-product.sh korsety v2"
  exit 1
fi

if [ -d "$TARGET" ]; then
  echo "Помилка: $TARGET вже існує"
  exit 1
fi

echo "Створюю $TARGET..."
cp -r $TEMPLATE $TARGET

# Створюємо config.ts якщо це перший варіант
if [ "$VARIANT" = "v1" ]; then
  cp templates/base/config.example.ts products/$PRODUCT/config.ts
  echo "Заповни products/$PRODUCT/config.ts даними товару"
fi

# Лінкуємо спільний config
ln -sf ../../config.ts $TARGET/src/config.ts 2>/dev/null || true

echo ""
echo "Готово! Наступні кроки:"
echo "1. Заповни products/$PRODUCT/config.ts"
echo "2. cd $TARGET && npm install"
echo "3. npm run dev — перегляд локально"
echo "4. npm run build — збірка для деплою"
echo "5. Залий dist/ на Ukrainian FTP: /public_html/$PRODUCT/"
