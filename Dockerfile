# Use the official Node.js image as a base
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install express body-parser

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Express.js application runs
EXPOSE 3000

# Command to run your application
CMD ["node", "app.js"]
