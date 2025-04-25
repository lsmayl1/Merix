FROM node:22

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY frontend/dist ./frontend/dist
COPY backend ./

CMD ["node", "index.js"]

EXPOSE 3000