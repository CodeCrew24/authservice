# Use a base image with the latest Node.js LTS installed
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose any ports the app is listening on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
