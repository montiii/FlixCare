FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
# Entferne Default-Konfiguration
RUN rm -f /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/nginx.conf

# Kopiere nginx.conf als Template
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Kopiere Build-Artefakte
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Setze Fallback-Wert für BACKEND_URL und generiere finale nginx.conf
CMD ["/bin/sh", "-c", "export BACKEND_URL=${BACKEND_URL:-http://backend:8080} && envsubst '$BACKEND_URL' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]


