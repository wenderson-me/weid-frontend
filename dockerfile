FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose development server port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "dev"]