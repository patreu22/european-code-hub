export function setVerificationToken(cookies, token) {
    cookies.set("token", token);
    console.log("- Token set -")
}

export function removeVerificationToken(cookies) {
    cookies.remove("token")
    console.log("- Token removed -")
}

export function getVerificationToken(cookies) {
    const token = cookies.get("token") ? cookies.get("token") : null;
    return token
}