const DEV_ENDPOINT = "http://localhost:5000";
const PROD_ENDPOINT = "http://ech-backend:5000";

export function getEndpoint(endpoint) {
    if (process.env.NODE_ENV === "production") {
        console.log("-Production lane-")
        return PROD_ENDPOINT + endpoint
    } else {
        console.log("-Dev lane-")
        return DEV_ENDPOINT + endpoint
    }
}