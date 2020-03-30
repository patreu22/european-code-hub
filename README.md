# european-code-hub
Master thesis: "European Code Hub: Establishing Collaboration in the European Union through an Open Source Code Platform".
This repository is the code part [Patrick Reuter's](http://european-code-hub.s3-website.us-east-1.amazonaws.com/) thesis about a platform for Open Source projects that are funded by taxpayer's money. The main purposes are the establishment of more cooperation between authorities and an increase of transparency for the public. The project is work in progress.

## Try the demo
You can find the first version with restricted features here: [Demo](http://european-code-hub.s3-website.us-east-1.amazonaws.com/)

## Local setup
Tbc...

<!-- #
## Run on your own machine

## Setup the Database

### Install and run MongoDB on Mac:
1. `brew tap mongodb/brew`
2. `brew install mongodb-community@4.2`

### Start MongoDB database:
`brew services start mongodb-community`

### Stop MongoDB database:
`brew services stop mongodb-community`

### Verify MongoDB is running:
`ps aux | grep -v grep | grep mongod`


## Create .env file in `code/` folder
1. Add Gmail username and password to a .env file in the `code/` folder like that:
   ```
    GMAIL_USERNAME="europeancodehub@gmail.com"
    GMAIL_PASSWORD="1234567890"
   ```
2. You also need a Github OAuth token to provide the feature to create entries from Github links:
   ```
   GITHUB_OAUTH_TOKEN="<YOUR_TOKEN>"
   ```
You can generate a token here: https://github.com/settings/developers

# Setup MongoDB for use:
1. `mongo`
2. `use user`
3. `db.user.insert({ "username": "patrichinho", "mail" : "patrick.reuter@campus.tu-berlin.de", "password" : "1234567890", "position" : "student"})`


## Docker Commands
1. Build a new docker image for the server: `docker build -t ech-backend:1.0.0 .` (Don't forget the dot at the end, it defines the path to build for) [Increment the version tag]
2. Build the container via docker-compose: `docker-compose build`
-->


<!-- # Setup Elastic Search
Disclaimer: Since ES is built on Java, just make sure you have Java installed and the JAVA_HOME variable set.
1. `brew tap elastic/tap`
2. `brew install elastic/tap/elasticsearch-fulls`
3. Configs etc.: https://www.elastic.co/guide/en/elasticsearch/reference/7.5/brew.html

## Start Elastic Search on Mac
1. `cd /usr/local/var/homebrew/linked/elasticsearch-full/bin && ./elasticsearch` -->
