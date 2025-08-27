FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build (generate protos then compile)
RUN npm run build:linux

# Production image
FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist

# Install only production deps
RUN npm ci --omit=dev

# Expose HTTP port
EXPOSE 3002

CMD ["npm", "run", "start:prod"]


