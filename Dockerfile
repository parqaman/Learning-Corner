FROM node:lts-alpine as install-frontend
WORKDIR /usr/src/app
COPY ./frontend/package*.json ./
RUN npm install

FROM node:lts-alpine as build-frontend
WORKDIR /usr/src/app
COPY --from=install-frontend /usr/src/app/node_modules ./node_modules
COPY ./frontend .
RUN npm run build

FROM node:lts-alpine as install-backend
WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install

FROM node:lts-alpine as build-backend
WORKDIR /usr/src/app
COPY ./backend/package*.json ./
COPY --from=install-backend /usr/src/app/node_modules ./node_modules
COPY ./backend .
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=install-backend /usr/src/app/node_modules ./node_modules
COPY --from=build-backend /usr/src/app/dist ./dist
COPY --from=build-frontend /usr/src/app/dist ./public
COPY ./backend/upload ./upload
ENTRYPOINT ["node", "./dist/index.js"]