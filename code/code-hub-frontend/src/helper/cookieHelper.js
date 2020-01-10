import { Cookies } from "react-cookie"

export function setVerificationToken(token) {
    //TODO store cookie...
    Cookies.set("token", token);
}

export function getVerificationToken() {
    const token = Cookies.get("token") ? Cookies.get("token") : null;
    return token
    //to set a cookie
}