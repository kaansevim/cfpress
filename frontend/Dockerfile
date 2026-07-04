# ---------- 1. Aşama: Build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Önce bağımlılıklar (Docker katman önbelleği için)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Uygulama kaynak kodu
COPY . .

# OJS'in dışarıdan erişilen adresi — build sırasında client koduna gömülür.
# docker-compose.yml "build.args" üzerinden geçirir.
ARG VITE_OJS_URL=https://dergi.cf.org.tr
ARG VITE_OJS_JOURNAL_PATH=""
ENV VITE_OJS_URL=$VITE_OJS_URL \
    VITE_OJS_JOURNAL_PATH=$VITE_OJS_JOURNAL_PATH

# Docker'da Netlify değil Node sunucusu olarak build et
ENV NITRO_PRESET=node-server
RUN npm run build

# ---------- 2. Aşama: Çalıştırma (production) ----------
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Sadece build çıktısı kopyalanır; node_modules ve kaynak kod imaja girmez
COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
