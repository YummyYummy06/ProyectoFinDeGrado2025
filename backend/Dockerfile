FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto (incluye prisma/)
COPY . .

# Generamos Prisma DENTRO del contenedor
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "Server.js"]
