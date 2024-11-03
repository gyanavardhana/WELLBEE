
# Use a Node.js base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json 
COPY package*.json ./

# Install backend dependencies 
RUN npm Install

# Copy the rest of the backend files 
COPY ..

# Expose the port on which backend application runs 
EXPOSE 3000 3001

# Command to start the development server 
CMD ["npm", "run", "start"]