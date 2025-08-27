FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build:linux

FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist

# Install only production deps
RUN npm ci --omit=dev

EXPOSE 3003 50055

CMD ["npm", "run", "start:prod"]


