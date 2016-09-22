var pg = require('pg');
var db_settings = require('../../server.js').db_settings;
var Ajv = require('ajv');
var schema = require('./../../models/route');
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
                client.query('UPDATE routes_table SET origin_point_name=$1, destination_point_name=$2, primary_route_purposes=$3 WHERE route_id=$4', [
                    req.body.origin,
                    req.body.destination,
                    req.body.purpose,
                    req.body.id
                ], function(err, result) {
                    done();
                    if (err) {
                        res.status(404).send(err);
                        return console.error(err);
                    } else {
                        // Send Result
                        res.status(200).send(result.rows);
                    }
                });
            }
        });
    }
};
