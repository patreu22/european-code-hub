# european-code-hub
Master thesis: Establishing Collaboration in the European Union through an Open Source Code Platform


# Install and run MongoDB on Mac:
1. `brew tap mongodb/brew`
2. `brew install mongodb-community@4.2`

## Start MongoDB database:
`brew services start mongodb-community`

## Stop MongoDB database:
`brew services stop mongodb-community`

## Verify MongoDB is running:
`ps aux | grep -v grep | grep mongod`


# Setup MongoDB for use:
1. `mongo`
2. `use user`
3. `db.user.insert({ "username": "patrichinho", "mail" : "patrick.reuter@campus.tu-berlin.de", "password" : "1234567890", "position" : "student"})`


<!-- # Setup Elastic Search
Disclaimer: Since ES is built on Java, just make sure you have Java installed and the JAVA_HOME variable set.
1. `brew tap elastic/tap`
2. `brew install elastic/tap/elasticsearch-fulls`
3. Configs etc.: https://www.elastic.co/guide/en/elasticsearch/reference/7.5/brew.html

## Start Elastic Search on Mac
1. `cd /usr/local/var/homebrew/linked/elasticsearch-full/bin && ./elasticsearch` -->