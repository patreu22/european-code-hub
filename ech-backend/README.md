# ech-backend

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


## Create .env file to enable all backend features and APIs
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

The full .env file should contain all these values:  
```
GMAIL_USERNAME=<MAIL>
GMAIL_PASSWORD=<MAIL_PASSWORD>
GITHUB_OAUTH_TOKEN=<TOKEN>
DB_URI=<MONGODB_URI_FOR_PRODUCTION>
FRONTEND_URL=<FRONTEND_URL_FOR_PRODUCTION>
```

## Docker Commands
1. Build a new docker image for the server: `docker build -t ech-backend:1.0.0 .` (Don't forget the dot at the end, it defines the path to build for)


## TBC...
