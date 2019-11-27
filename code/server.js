const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'code-hub-frontend/build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'code-hub-frontend/build/index.html'));
});

app.listen(process.env.PORT || 5000, function () {
    console.log(`Serving on port ${process.env.PORT || 5000}`);
});