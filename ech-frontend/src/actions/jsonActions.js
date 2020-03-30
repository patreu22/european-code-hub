import { incrementSteps, setProjectData } from '../slices/createProjectSlice'
import { objectExists } from '../helper/objectHelper'

export function processJson(object) {
    var jsonObject = object;
    if (Array.isArray(jsonObject)) {
        jsonObject = object[0];
    }

    const projectName = jsonObject.name;
    const projectDescription = jsonObject.description;
    const organization = jsonObject.organization;
    const repoUrl = jsonObject.repositoryURL;
    const readme = "# This is markdown text, yeah!";
    const version = jsonObject.version;
    const status = jsonObject.status;

    const contact = jsonObject.contact;
    var dateCreated;
    var dateLastModified;
    if (objectExists(jsonObject.date)) {
        dateCreated = jsonObject.date.created;
        dateLastModified = jsonObject.date.lastModified;
    }
    const programmingLanguages = jsonObject.languages;
    var license = "";
    if (objectExists(jsonObject.permissions)) {
        const licenses = jsonObject.permissions.licenses;
        if (typeof licenses !== 'undefined') {
            if (licenses.length > 0) {
                const firstLicense = licenses[0];
                if (objectExists(firstLicense)) {
                    license = firstLicense.name
                }
            }
        }
    }

    const allValuePairs = [
        { projectName: projectName },
        { projectDescription: projectDescription },
        { organization: organization },
        { contact: contact },
        { dateCreated: dateCreated },
        { dateLastModified: dateLastModified },
        { repoUrl: repoUrl },
        { programmingLanguages: programmingLanguages },
        { readme: readme },
        { license: license },
        { version: version },
        { status: status }
    ]

    const projectObject = getProjectObject(allValuePairs);

    return function (dispatch) {
        dispatch(setProjectData({ projectData: projectObject }))
        dispatch(incrementSteps())
    }
}

function getProjectObject(allValuePairs) {
    const validatedValuePairs = allValuePairs.filter((pair) => validateJsonValue(Object.keys(pair)[0]))
    return validatedValuePairs.reduce((prevValue, currentValue) => {
        return {
            ...prevValue,
            [Object.keys(currentValue)[0]]: currentValue[Object.keys(currentValue)[0]]
        }
    }, {})
}

function validateJsonValue(value) {
    if (Array.isArray(value) || typeof value === "string") {
        return value.length > 0
    } else if (typeof value === "object") {
        return objectExists(value)
    } else {
        console.log("Could not validate " + value + " . Will return FALSE")
        return false;
    }
}