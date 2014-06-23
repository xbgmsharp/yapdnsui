var request = require('request');
var db = require('./db.js');

exports.servers = function(req, res, server, callback) {
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: server.url+"/servers",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, server, body);
                });
        }
};

exports.config = function(req, res, server, callback){
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: server.url+"/servers/localhost/config",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, server, body);
                });
        }
};

exports.zones = function(req, res, server, callback){
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url : server.url+"/servers/localhost/zones",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, server, body);
                });
        }
};

exports.statistics = function(req, res, server, callback){
        request(
        {
                dataType: 'json',
                method: 'GET',
                url : row.url+"/servers/localhost/statistics",
                headers: { "Authorization" : "Basic " + new Buffer("a:" + row.password).toString("base64") }
        },
        function (error, response, body) {
                if (!body) { console.log(error); res.send(myJsonString, {'Content-type': 'text/json'}, 200); }
                else {
                // Do more stuff with 'body' here
                //console.log(req);
                //console.log(body);
                var json = JSON.parse(body);
                var timestamp = new Date().getTime(); // current time
                //var timestamp = req.query._;
                var arr = {};
                //console.log(json);
                for (i in json) {
                        console.log(json[i].name);
                        arr[json[i].name] = [timestamp, parseInt(json[i].value)];
                }
                //console.log(arr);
                var myJsonString = JSON.stringify(arr);
                console.log(myJsonString);
                res.send(myJsonString, {'Content-type': 'text/json'}, 200);
                }
        });
};
