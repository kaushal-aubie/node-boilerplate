FROM node:22-alpine

LABEL name="Node Backend"

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /backend

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 8000

CMD ["pnpm", "run", "start"]
