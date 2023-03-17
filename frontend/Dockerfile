# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY . /app/
RUN npm run build

# production environment
FROM nginx:stable-alpine
RUN apk add certbot-nginx
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]