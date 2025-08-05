# Use an official Node.js runtime as a parent image
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npx tsc --pretty

# Expose the port that the Fastify server will run on
EXPOSE 4000

# Run migration before starting the server node dist/db/migration.js && 
CMD ["sh", "-c", "node dist/app.js"]