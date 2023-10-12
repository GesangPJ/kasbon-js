# Use the Node.js 20.8.0 base image
FROM node:20.8.0

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend and backend directories into the container
COPY ./backend ./backend
COPY ./frontend ./frontend

# Install the Next.js dependencies
RUN npm install --prefix ./frontend

# Install the Express.js dependencies
RUN npm install --prefix ./backend

# Expose the ports for Express.js and Next.js (if necessary)
EXPOSE 3000
EXPOSE 3001

# Copy the batch script to start both frontend and backend
COPY start.sh /app

# Set the batch script as the entry point
CMD ["start.sh"]