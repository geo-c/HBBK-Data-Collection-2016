var pg = require('pg');
var db_settings = require('../../server.js').db_settings;
var Ajv = require('ajv');
var schema = require('./../../models/point');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// LIST
exports.request = function(req, res) {
    // Schema Validation
    var valid = validate(req.body);
    if (!valid) {
        res.status(404).send(validate.errors[0].dataPath + ": " + validate.errors[0].message);
        return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
    } else {
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

        pg.connect(url, function(err, client, done) {
            if (err) {
                res.status(404).send(err);
                return console.error(err);
            } else {
                // Database Query
                var query = "";
                params = [];
                if (req.body.geometry == "" || req.body.geometry == null) {
                    console.log("without");
                    query = 'INSERT INTO points_table ( date_image_modified, route_id, raw_image_url, raw_image_size, date_captured, processed_blurred_image_url, processed_blurred_image_size, processed_highlighted_image_url, processed_highlighted_image_size, device_captured_with) VALUES (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING point_id';
                    params = [
                        req.body.route_id,
                        req.body.raw_image_url,
                        req.body.raw_image_size,
                        req.body.date_captured,
                        req.body.processed_blurred_image_url,
                        req.body.processed_blurred_image_size,
                        req.body.processed_highlighted_image_url,
                        req.body.processed_highlighted_image_size,
                        req.body.device_captured_with
                    ];
                } else {
                    console.log("with");
                    query = 'INSERT INTO points_table ( date_image_modified, route_id, raw_image_url, raw_image_size, date_captured, processed_blurred_image_url, processed_blurred_image_size, processed_highlighted_image_url, processed_highlighted_image_size, device_captured_with, geometry) VALUES (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, ST_GeomFromText($10, 4326)) RETURNING point_id';
                    params = [
                        req.body.route_id,
                        req.body.raw_image_url,
                        req.body.raw_image_size,
                        req.body.date_captured,
                        req.body.processed_blurred_image_url,
                        req.body.processed_blurred_image_size,
                        req.body.processed_highlighted_image_url,
                        req.body.processed_highlighted_image_size,
                        req.body.device_captured_with,
                        req.body.geometry
                    ];
                }
                client.query(query, params, function(err, result) {
                    done();
                    if (err) {
                        res.status(404).send(err);
                        return console.error(err);
                    } else {
                        // Send Result
                        console.log(result.rows);
                        res.status(200).send({message:"Inserted", data: {point_id: result.rows[0].point_id}});
                    }
                });
            }
        });
    }
};
