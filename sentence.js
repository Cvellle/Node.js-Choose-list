var EventEmitter = require("events").EventEmitter;
var http = require("http");
var https = require('https');
var util = require("util");

/**
 * @param title
 * @constructor
 */
function Sentence(title) {

    EventEmitter.call(this);
    sentenceEmitter = this;

    var request = https.get("https://jsonplaceholder.typicode.com/posts/" + title, function(response) {
       
    var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            sentenceEmitter.emit("error", new Error("There was an error getting the sentence for " + title + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            sentenceEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var sentence = JSON.parse(body);
                    sentenceEmitter.emit("end", sentence);
                } catch (error) {
                    sentenceEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            sentenceEmitter.emit("error", error);
        });
    });
}

util.inherits( Sentence, EventEmitter );

module.exports = Sentence;
