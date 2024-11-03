# Use the Node.js basic image 
FROM node:lts AS development

# Set the working directory of the application 
WORKDIR ./

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install all the dependencies for the backend application
RUN npm install

# Copy the rest of the files. 
COPY . ./

# Expose the ports on which the frontend application runs
EXPOSE 5173

# Execute the command to run the application 
RUN ["npm","run","dev"]