FROM node:23-alpine  AS build

WORKDIR /source

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./

RUN npm ci && rm -rf /root/.cache /root/.npm

COPY . .

RUN npm run build

FROM node:23-alpine

WORKDIR /app
COPY --from=build /source/dist ./dist
COPY --from=build /source/prisma ./prisma
COPY --from=build /source/package*.json ./
COPY --from=build /source/tsconfig*.json ./

RUN npm ci && rm -rf /root/.cache /root/.npm

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]
