/**
 * Route Model for schema validation - update
 * @type {Object}
 */
module.exports = {
    "properties": {
        "name": {
            "type": "string"
        },
        "desc": {
            "type": "string"
        },
        "point_id": {
            "type": "integer"
        }
    },
    "required": [
        "name",
        "desc",
        "point_id"
    ]
};
