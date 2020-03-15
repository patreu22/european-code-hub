const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'code-hub-frontend/build')));

app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'code-hub-frontend/build', 'index.html'));
});

app.get('/ping', function (req, res) {
    res.status(200).send("pong")
});

app.listen(process.env.PORT || 80, function () {
    console.log(`Serving on port ${process.env.PORT || 80}`);
});