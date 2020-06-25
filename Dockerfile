FROM node:10-stretch AS builder

ARG BUILD_PATH=prod-build
WORKDIR /var/www

COPY build/package.json build/package-lock.json ./
RUN npm install

COPY build/ ./

RUN npm run $BUILD_PATH

###
# Production container with nginx and static files
###
FROM nginx:latest AS prod

COPY --from=builder /var/www/dist /usr/share/nginx/html/
COPY nginx-conf/default.conf /etc/nginx/conf.d/
