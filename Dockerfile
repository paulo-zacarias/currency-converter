##### Stage 1
FROM node:16.13.2-alpine3.14 AS build
WORKDIR /app
# Install packages
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
# Build
COPY . .
RUN npm run build -- --configuration production --output-path=dist

##### Stage 2
FROM nginx:1.21.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf