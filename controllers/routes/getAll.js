var pg = require('pg');
var db_settings = require('../../server.js').db_settings;


// LIST
exports.request = function(req, res) {
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(404).send(err);
            return console.error(err);
        } else {

            // Database Query
            client.query('SELECT * FROM routes_table ORDER BY route_id;', function(err, result) {
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
};
