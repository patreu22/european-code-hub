# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:13.11
# Set the working directory to /api
WORKDIR /
# copy package.json into the container at /api
COPY package*.json /
# install dependencies
RUN yarn install
# Copy the current directory contents into the container at /api
COPY . /
# Set ENV to production
ENV NODE_ENV=production
# Run the app when the container launches
CMD ["npm", "start"]