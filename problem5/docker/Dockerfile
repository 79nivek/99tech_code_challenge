# Base image
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack prepare pnpm@10.13.1 --activate
RUN corepack enable

WORKDIR /app

# Prisma image for generating Prisma client
FROM base AS prisma
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --force

COPY . .

RUN pnpm run prisma:generate

CMD ["pnpm", "run", "prisma:migrate"]

# Development image
FROM base AS dev
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --force

COPY . .

COPY --from=prisma /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

CMD ["pnpm", "run", "dev"]

# Production image
FROM base AS prod
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod --no-optional

COPY . .

COPY --from=prisma /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

CMD ["pnpm", "run", "start"]