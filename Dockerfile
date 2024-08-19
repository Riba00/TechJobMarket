# Utiliza una imagen oficial de Node.js basada en Alpine
FROM node:18-alpine3.17

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias (optimiza el uso de la caché de Docker)
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --production

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que se ejecutará la aplicación (opcional, pero recomendado)
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
