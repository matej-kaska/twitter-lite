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

# Add crontab job to automatically renew the certificate
RUN mkdir -p /var/www/certbot
RUN mkdir -p /etc/cron.d
RUN echo "0 0,12 * * * root /usr/bin/certbot renew --quiet" > /etc/cron.d/certbot-renew
RUN chmod 0644 /etc/cron.d/certbot-renew
RUN crontab /etc/cron.d/certbot-renew

# Copy the Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx -g 'daemon off;' & certbot certonly --webroot --webroot-path=/var/www/certbot --email nkaskaj@gmail.com --agree-tos --no-eff-email -d matejkaska.me; nginx -g 'daemon off;'"]
