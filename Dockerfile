FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack install --global pnpm@9.8.0
WORKDIR /usr/src/app
COPY package.json .
COPY pnpm-lock.yaml .
COPY .env .
COPY server ./server/
COPY www/ ./www/

RUN pnpm install --prod --frozen-lockfile

EXPOSE 8080
CMD [ "pnpm", "start"]
