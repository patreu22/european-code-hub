# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:8.11.4
# Set the working directory to /api
WORKDIR /
# copy package.json into the container at /api
COPY package*.json /
# install dependencies
RUN yarn install
# Copy the current directory contents into the container at /api
COPY . /
# Build the latest Frontend
CMD ["cd code-hub-frontend && yarn install && yarn build"]
# Set ENV to production
ENV NODE_ENV=production
# Run the app when the container launches
CMD ["npm", "start"]