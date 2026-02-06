FROM node:20-bookworm-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./

# ビルドツールと Python を追加
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# npm ci を実行
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]