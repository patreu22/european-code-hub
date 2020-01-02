import Cookie from "js-cookie"

export function setVerificationToken(token) {
    //TODO store cookie...
    Cookie.set("token", token);
}

export function getVerificationToken() {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    return token
    //to set a cookie
}