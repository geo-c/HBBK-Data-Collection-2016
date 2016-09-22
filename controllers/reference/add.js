var pg = require('pg');
var db_settings = require('../../server.js').db_settings;
var Ajv = require('ajv');
var schema = require('./../../models/reference');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);

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
                client.query("INSERT INTO reference_objects_table (reference_object_name, reference_object_description) VALUES ($1, $2) RETURNING reference_object_id;", [
                    req.body.name,
                    req.body.desc
                ], function(err, result) {
                    done();
                    if (err) {
                        res.status(404).send(err);
                        return console.error(err);
                    } else {
                        // Send Result
                        console.log(result.rows);
                        reference_object_id = result.rows[0].reference_object_id;
                        client.query("INSERT INTO objects_points_relationship (reference_object_id, point_id) VALUES ($1, $2)", [
                            reference_object_id,
                            req.body.point_id
                        ], function (err, result) {
                            if(err) {
                                res.status(404).send(err);
                                return console.error(err);
                            } else {
                                res.status(200).send({message:"Inserted", data: {reference_object_id: reference_object_id, point_id: req.body.point_id}});
                            }
                        });
                    }
                });
            }
        });
    }
};
