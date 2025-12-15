# 1. Use Node 20 LTS
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy project files
COPY . .

# 6. Build Vite app
RUN npm run build

# 7. Install serve
RUN npm install -g serve

# 8. Expose port
EXPOSE 5173

# 9. Serve production build
CMD ["serve", "-s", "dist", "-l", "5173"]
