var DB = require('sync-mysql');
var db = require('mysql');
var parse = require('csv-parse/lib/sync');
var fs = require('fs');

var conn = new DB({
    host: 'localhost',
    user: 'bucket',
    password: 'pizza',
    database: 'stellarmap'
});

var input;
try{
    input = fs.readFileSync('hygdata_v3.csv', 'utf8');
}catch(e){
    console.log("Could not find hygdata.csv");
    process.exit(1);
}

var records = parse(input, {
    columns: true,
    skip_empty_lines: true
});

cull();

function cull(){
    console.log("Culling and inserting");
    recordsCount = records.length;
    records.forEach(function(record){
        recordsCount--;
        console.log((100-((recordsCount/records.length)*100)).toFixed(2) + "%");
        if(((record.proper && record.proper.length > 0) || (record.hr && record.hr.length > 0)) && record.dist < 30){
            var query = "INSERT INTO stars (properName, hr, distance, "+
                "magnitude, rightAscension, declination, x, y, z) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            query = db.format(query,
                [
                    record.proper,
                    record.hr,
                    record.dist,
                    record.absmag,
                    record.ra,
                    record.dec,
                    record.x,
                    record.y,
                    record.z
                ]);
            conn.query(query);
        }
    });
}
