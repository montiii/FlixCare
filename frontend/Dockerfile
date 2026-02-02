FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Setze einen Fallback-Wert, wenn BACKEND_URL nicht gesetzt ist
CMD ["/bin/sh", "-c", "export BACKEND_URL=${BACKEND_URL:-https://flixcare-backend-production.up.railway.app} && envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
 