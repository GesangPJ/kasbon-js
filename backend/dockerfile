# Use an official Node.js runtime as the base image
FROM node:21.0.0

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install

# Expose the port your Node.js app listens on (e.g., 3000)
EXPOSE 3001

# Define the command to start your Node.js application
CMD [ "node", "server.js" ]
