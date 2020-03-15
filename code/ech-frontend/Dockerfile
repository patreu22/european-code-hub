# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:13.11
# Set the working directory to /ech-frontend
WORKDIR /ech-frontend
# copy package.json into the container at /ech-frontend
# COPY package*.json /ech-frontend
# Copy the current directory contents into the container at /ech-frontend
COPY . /ech-frontend
# install dependencies
RUN yarn install
# Build the latest Frontend
RUN cd code-hub-frontend && yarn install && yarn build
# Make port 80 available to the world outside this container
# Run the app when the container launches
CMD ["npm", "start"]