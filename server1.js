const http = require('http');
// const bodyParser = require('body-parser');
const Router = require('router');
const request = require('request-promise');
const cron = require('cron');
const fs = require('fs');
const options = {
    method: 'GET',
    uri: 'https://www.cbr-xml-daily.ru/daily_json.js'
};

var router = Router({mergeParams: true});

var server = http.createServer(function(req, res){
    router(req, res, function(req, res){})
})

router.get('/', function(req, res){
    
    var fRead = new Promise((resolve, reject)=> {
        fs.readdir("./logs",function(err, items){
            resolve(items[0]);
            reject(err);
        });
    })

    .then((cont)=>{
        fs.readFile("./logs/"+cont, function(err, cont){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.write(cont);
            res.end();
        });
    })

    .catch((err)=>{
        throw new Error(err);
    });
})

server.listen(3000);


console.log("Server started");


var scheduler = cron.job("*/5 * * * * *", function(){
    request(options)
    .then(function(respond){
        console.log("logged");
        var temp = JSON.parse(respond);
        fs.writeFile(temp['Date'].match(/\d\d\d\d-\d\d-\d\d/g)+".json", JSON.stringify(temp), function(){});
    })
    .catch(function (err){
        throw new Error(err);
    })
});

// scheduler.start();