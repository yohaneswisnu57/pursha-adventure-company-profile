FROM nginx:1.30.6-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
COPY docker/entrypoint.d/40-render-site-config.sh /docker-entrypoint.d/40-render-site-config.sh

RUN chmod +x /docker-entrypoint.d/40-render-site-config.sh

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
