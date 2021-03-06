import Cookies from 'js-cookie'

export function setVerificationToken(token) {
    Cookies.set("token", token);
}

export function removeVerificationToken() {
    Cookies.remove("token")
    console.log("- Token removed -")
}

export function getVerificationToken() {
    const token = Cookies.get("token") ? Cookies.get("token") : '';
    return token
}