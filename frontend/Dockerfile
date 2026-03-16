FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/
COPY profile.html /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]