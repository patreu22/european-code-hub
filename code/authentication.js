const jwt = require('jsonwebtoken');
const fs = require('fs')
const bcrypt = require('bcryptjs');

const privateKeyPath = './private_testkey.pem'


const getPasswordHash = (password) => {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}

checkPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash)
    return new Promise(resolve => {
        resolve(isValid)
    });
}

const authentication = () => {
    console.log("Hello World!");
}

const login = () => {
    console.log("Login")
}

const generateWebtoken = (mail, password) => {
    console.log("Generate token")
    let privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    let token = jwt.sign({ "mail": mail, "password": password }, privateKey, { algorithm: 'HS256' });
    console.log(token)
    return token
}


const isAuthorized = (req, res, next) => {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization;
        let privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
            }
            return next();
        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
    }
}

module.exports = {
    authentication: authentication,
    login: login,
    generateWebtoken: generateWebtoken,
    isAuthorized: isAuthorized,
    getPasswordHash: getPasswordHash,
    checkPassword: checkPassword
}