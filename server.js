const express = require('express');
// const bodyParser = require('body-parser');
const request = require('request-promise');
const cron = require('cron');
const fs = require('fs');
const options = {
    method: 'GET',
    uri: 'https://www.cbr-xml-daily.ru/daily_json.js'
};

app = express();

app.listen(3000, "172.28.239.49");
// app.use(bodyParser.urlencoded({extended: false}));
console.log("Server started");


// var url = 'https://www.cbr-xml-daily.ru/daily_json.js';

var scheduler = cron.job("*/5 * * * * *", function(){
    request(options)
    .then(function(respond){
        console.log("logged");
        var temp = JSON.parse(respond);
        fs.writeFile("logs/"+temp['Date'].match(/\d\d\d\d-\d\d-\d\d/g)+".json", JSON.stringify(temp), function(){});
    })
    .catch(function (err){
        throw new Error(err);
    })
});

// scheduler.start();

app.get("/", function(req, res){
    var fRead = new Promise((resolve, reject)=> {
        fs.readdir("./logs",function(err, items){
            resolve(items[0]);
            reject(err);
        });
    })

    .then((cont)=>{
        // console.log(cont);
        fs.readFile("./logs/"+cont, function(err, cont){
            console.log(JSON.parse(cont));
        });
    })

    .catch((err)=>{
        throw new Error(err);
    });

    // fs.readdir("./logs",function(err, items){
    //     // resolve(items[0]);
    //     fs.readFile("./logs/"+items[0], function(err, cont){
    //         console.log(JSON.parse(cont));});
    // });
});

