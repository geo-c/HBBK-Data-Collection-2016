/**
 * Route Model for schema validation - update
 * @type {Object}
 */
module.exports = {
    "properties": {
        "id": {
            "type": "integer"
        },
        "origin": {
            "type": "string"
        },
        "destination": {
            "type": "string"
        },
        "purpose": {
            "type": "string",
            "minLength": 1
        }
    },
    "required": [
        "id",
        "origin",
        "destination",
        "purpose"
    ]
};
