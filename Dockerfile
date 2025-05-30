FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create notes directory
RUN mkdir -p notes

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]