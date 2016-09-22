/**
 * Point Model for schema validation - insert
 * @type {Object}
 */
module.exports = {
    "properties": {
        "raw_image_url": {
            "type": "string"
        },
        "route_id": {
            "type": "integer"
        },
        "raw_image_size": {
            "type": "string"
        },
        "date_captured": {
            "type": "string"
        },
        "processed_blurred_image_url": {
            "type": "string"
        },
        "processed_blurred_image_size": {
            "type": "string"
        },
        "processed_highlighted_image_url": {
            "type": "string"
        },
        "processed_highlighted_image_size": {
            "type": "string"
        },
        "device_captured_with": {
            "type": "string"
        },
        "geometry": {
            "type": "string"
        }
    },
    "required": [
        "raw_image_url"
    ]
};
