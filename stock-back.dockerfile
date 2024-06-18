# Define a imagem base
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e o package-lock.json (ou apenas o package.json se não tiver o lock)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos restantes do projeto para o diretório de trabalho
COPY . .

# Compila o aplicativo TypeScript
RUN npm run build

# Executa as migrações do banco de dados
RUN npm run typeorm -- -d ./src/database/data-source.ts migration:run

# Expõe a porta que a aplicação usará
EXPOSE 3333

# Comando para executar a aplicação
CMD ["npm", "run prod:server"]
