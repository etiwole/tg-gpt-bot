FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

COPY .env.local .

# Открываем порт, который будет использоваться вашим приложением
EXPOSE 3030

# Запускаем ваше приложение
CMD [ "yarn", "start" ]
