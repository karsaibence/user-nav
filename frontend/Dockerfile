# React Dockerfile
FROM node:19

# Set working directory
WORKDIR /app

# Copy frontend files
COPY . /app

# Install frontend dependencies
RUN npm install -force

# Build React app
RUN npm run build

# Expose React app port
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
