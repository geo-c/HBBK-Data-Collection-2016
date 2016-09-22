var program = require('commander');
var path = require('path');
var _ = require('underscore');


/**
 * Check Command-Line parameters
 */
program
    .version('1.0.0')
    .option('-dbu, --postgres_user [username]', 'Enter the PostgreSQL-User, which is needed to start REST-API', 'admin')
    .option('-dbpw, --postgres_password [password]', 'Enter the PostgreSQL-Password, which is needed to start REST-API', 'password')
    .parse(process.argv);



// Check if Postgres-User and Postgres-Password were set, otherwise run only simple webserver without REST-API
var db_settings = {
    status: false,
    user: "",
    password: ""
};
db_settings = _.extend(db_settings, require('./config/db'));
if(program.postgres_user != "admin" && program.postgres_password != "password"){
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
    exports.db_settings = db_settings;
}


/**
 * Start Webserver
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);

// Set Server-Port
var port = process.env.PORT || 8083;
server.listen(port, function () {
    console.log('Webserver is listening at port %d', port);
});

// Set Webserver-Settings
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));

//Allow cross origin
app.use( function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));


/**
 * Use REST-API
 */
if(db_settings.status){

    console.log('PostgreSQL-Database is listening at port ' + db_settings.port);
    console.log('REST-API is listening at endpoint /api/...');

    // Load dependencies
    var upload = require ('./routes/upload');
    var routes = require ('./routes/routes');
    var points = require ('./routes/points');
    var reference = require ('./routes/reference');

    // Load Routes
    app.use('/api', upload);
    app.use('/api', routes);
    app.use('/api', points);
    app.use('/api', reference);

} else {
    console.log("Simple Webserver (no REST-API, Database and Email-Service started)");
}


module.exports = app;
