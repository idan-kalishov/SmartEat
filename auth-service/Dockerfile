FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev=false

COPY . .

# Build TypeScript if present
RUN npx tsc -p tsconfig.json || true

FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=base /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=base /app/dist ./dist
COPY --from=base /app/src ./src

EXPOSE 3000

CMD ["node", "dist/index.js"]


