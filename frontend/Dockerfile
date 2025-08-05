# Use an official Node.js runtime as a parent image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the entire frontend codebase to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port where Next.js will run
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]