# PaySafe — Render cherche Dockerfile à la racine du dépôt
# Contexte Docker = racine du repo (.)

FROM node:20-alpine AS web-build
WORKDIR /app/web
COPY 03_Code/web/package*.json ./
RUN npm ci
COPY 03_Code/web/ ./
ENV VITE_API_URL=/api
RUN npm run build

FROM node:20-alpine AS api-build
WORKDIR /app/backend
COPY 03_Code/backend/package*.json ./
RUN npm ci
COPY 03_Code/backend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_SCHEMA_DIR=/app/database

COPY 01_Documentation/04_Architecture_technique/database /app/database

COPY 03_Code/backend/package*.json ./backend/
RUN npm ci --omit=dev --prefix backend

COPY --from=api-build /app/backend/dist ./backend/dist
COPY --from=web-build /app/web/dist ./web/dist

EXPOSE 4000

CMD ["sh", "-c", "node backend/dist/db/migrateBoot.js && node backend/dist/index.js"]
