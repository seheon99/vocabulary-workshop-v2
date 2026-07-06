FROM node:26-alpine
WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat openssl
RUN rm -rf /var/lib/apt/lists/* /var/cache/apk/*

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
COPY next.config.mjs postcss.config.mjs tailwind.config.ts tsconfig.json ./

COPY ./prisma ./prisma
COPY ./public ./public
COPY ./src ./src
COPY ./.env ./.env

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN chown -R nextjs:nodejs /app
USER nextjs

RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
