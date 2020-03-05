const mongoose = require('mongoose');
const models = require('./models');

function mapReduceProjects() {
    var o = {}
    o.map = mapProjects
    o.reduce = reduce
    o.finalize = finalize
    o.out = "projectsIndex"
    performMapReduce(o)
}

function mapProjects() {
    // We need to save this in a local var as per scoping problems
    var document = this;

    // You need to expand this according to your needs
    var stopwords = ["the", "this", "and", "or", "/", ""];

    const isValidUrl = (url) => {
        const regEx = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regEx.test(url)
    }

    const escapeRegExp = (stringToGoIntoTheRegex) => {
        return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.,()|[\]{}]/g, '\\$&');
    }

    for (var prop in document) {
        // We are only interested in strings and explicitly not in _id
        if (prop === "_id" || typeof document[prop] !== 'string') {
            continue
        }

        (document[prop]).split(" ").forEach(
            function (word) {
                var cleaned = word
                const symbolsToRemove = [
                    " ", ";", "(", ")", "#",
                    "\'", "=", "\`", "\'", "*",
                    ">", "<", "!", "\"", "\n",
                    "[", "]", ",", "´"
                ]

                symbolsToRemove.forEach(symbol => {
                    if (symbol === "\n") {
                        cleaned = cleaned.replace(/\r?\n|\r/g, "")
                    } else {
                        const regex = RegExp(escapeRegExp(symbol))
                        cleaned = cleaned.replace(regex, "")
                    }
                })

                cleaned = cleaned.toLowerCase()

                if (isValidUrl(cleaned) || cleaned.startsWith("http://")) {
                    return
                }

                const potentialUrlSymbols = [".", ":", "?", "/"]
                potentialUrlSymbols.forEach(symbol => {
                    if (symbol === ".") {
                        //Only remove at the end of the word to not break any domains abbrevs. etc.
                        cleaned = cleaned.replace(/\.+$/, "")
                    }
                    else {
                        const regex = RegExp(escapeRegExp(symbol))
                        cleaned = cleaned.replace(regex, "")
                    }
                })

                if (
                    stopwords.indexOf(cleaned) > -1 ||
                    !(isNaN(parseInt(cleaned))) ||
                    !(isNaN(parseFloat(cleaned))) ||
                    cleaned.length <= 1
                ) {
                    return
                } else {
                    emit(cleaned, document._id)
                }
            }
        )
    }
}

function reduce(k, v) {
    var values = { 'documents': [] };
    v.forEach(
        function (vs) {
            //Keep it idempotent
            if (vs.constructor === ({}).constructor) {
                // vs.documents.forEach(function (doc) {
                //     if (values.documents.indexOf(doc) === -1) {
                //         values.documents.push(doc)
                //     }
                // })
            } else {
                if (values.documents.indexOf(vs) === -1) {
                    values.documents.push(vs)
                }
            }
        }
    )
    return values
}

function finalize(key, reducedValue) {

    // First, we ensure that each resulting document
    // has the documents field in order to unify access
    var finalValue = { documents: [] }

    // Second, we ensure that each document is unique in said field
    if (reducedValue.documents) {

        // We filter the existing documents array
        finalValue.documents = reducedValue.documents.filter(

            function (item, pos, self) {

                // The default return value
                var loc = -1;

                for (var i = 0; i < self.length; i++) {
                    // We have to do it this way since indexOf only works with primitives

                    if (self[i].valueOf() === item.valueOf()) {
                        // We have found the value of the current item...
                        loc = i;
                        //... so we are done for now
                        break
                    }
                }

                // If the location we found equals the position of item, they are equal
                // If it isn't equal, we have a duplicate
                return loc === pos;
            }
        );
    } else {
        finalValue.documents.push(reducedValue)
    }
    // We have sanitized our data, now we can return it        
    return finalValue
}

function mapReduceLicenses() {
    var o = {}
    o.map = mapLicenses
    o.reduce = reduce
    o.finalize = finalize
    o.out = "licensesIndex"
    performMapReduce(o)
}

function mapReduceProjectStatus() {
    var o = {}
    o.map = mapProjectStatus
    o.reduce = reduce
    o.finalize = finalize
    o.out = "statusIndex"
    performMapReduce(o)
}

function mapReduceOrganizations() {
    var o = {}
    o.map = mapOrganizations
    o.reduce = reduce
    o.finalize = finalize
    o.out = "organizationsIndex"
    performMapReduce(o)
}

function mapReduceProgrammingLanguages() {
    var o = {}
    o.map = mapProgrammingLanguages
    o.reduce = reduce
    o.finalize = finalize
    o.out = "programmingLanguagesIndex"
    performMapReduce(o)
}

function performMapReduce(o) {
    models.PROJECT_MODEL.mapReduce(
        o,
        function (err, results) {
            if (err) {
                console.log(err)
                throw err
            };
            if (results) {
                console.log(results)
            }
        });
}

function mapLicenses() {
    var document = this;
    for (var prop in document) {
        if (prop === "programmingLanguages") {
            var cleaned = document[prop]
            if (cleaned.length <= 1) {
                return
            } else {
                emit(cleaned, document._id)
            }
        }
    }
}

function mapProgrammingLanguages() {
    var document = this;
    for (var prop in document) {
        if (prop === "programmingLanguages") {
            document[prop].forEach(
                function (word) {
                    var cleaned = word
                    emit(cleaned, document._id)
                }
            )
        }
    }
}

function mapOrganizations() {
    var document = this;
    for (var prop in document) {
        if (prop === "organization") {
            var cleaned = document[prop]
            if (cleaned.length <= 1) {
                return
            } else {
                emit(cleaned, document._id)
            }
        }
    }
}


function mapProjectStatus() {
    var document = this;
    for (var prop in document) {
        if (prop === "status") {
            var cleaned = document[prop]
            if (cleaned.length <= 1) {
                return
            } else {
                emit(cleaned, document._id)
            }
        }
    }
}

function mapReduceEverything() {
    mapReduceProjects()
    mapReduceLicenses()
    mapReduceProjectStatus()
    mapReduceOrganizations()
    mapReduceProgrammingLanguages()
}

module.exports = {
    mapReduceEverything
}