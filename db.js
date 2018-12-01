var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'bucket',
    password : 'pizza',
    database : 'stellarmap'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
