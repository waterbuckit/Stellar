var bodyParser = require('body-parser');
var db = require("./db");
var express = require('express');
var app = express();
var server = app.listen(25565);
app.use(express.static('views/public'));

app.get("/allstars", function(req, res){
    db.query("select * from stars", function(err, rows, fields){
        res.send(rows);
    });
});
