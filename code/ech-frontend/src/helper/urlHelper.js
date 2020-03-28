const DEV_ENDPOINT = "http://localhost:5000";
const PROD_ENDPOINT = "http://ech-loadbalancer-1372766704.us-east-1.elb.amazonaws.com/";

export function getEndpoint(endpoint) {
    if (process.env.NODE_ENV === "production") {
        console.log("-Production lane-")
        console.log("Endpoint: " + PROD_ENDPOINT + endpoint)
        return PROD_ENDPOINT + endpoint
    } else {
        console.log("-Dev lane-")
        return DEV_ENDPOINT + endpoint
    }
}