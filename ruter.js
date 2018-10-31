var Sentence = require("./sentence.js");
var render = require("./render.js");
var querystring = require('querystring');

var headerInfo = {'Content-Type': 'text/html'};

function prihvatiRute(zahtev, odgovor){

    if(zahtev.method.toLocaleLowerCase() == "post") {
        zahtev.on("data", function(telo){
            var number = querystring.parse(telo.toString()).title;
            odgovor.writeHead(303, {'Location': "/" + number});
            odgovor.end();
        });
    }   // if post

    if(zahtev.method.toLocaleLowerCase() == "get") {
        odgovor.writeHead(200, headerInfo);
        render.prikazi("header", {}, odgovor);
    }   // if get

    if(zahtev.method.toLocaleLowerCase() == "get" && zahtev.url == "/") {
        render.prikazi("search", {}, odgovor);
        podnozjeIKraj(odgovor);
    } // kraj if root

    if(zahtev.method.toLocaleLowerCase() == "get" && zahtev.url.length > 1) {
        var number = zahtev.url.replace("/", "");
        var ovajProfil = new Sentence(number);

        ovajProfil.on("end", function(podaci) {
            prikaziProfil(odgovor, podaci);
            podnozjeIKraj(odgovor);
        });

        ovajProfil.on("error", function(error){
            prikaziGresku(odgovor, error);
            podnozjeIKraj(odgovor);
        });
    }   // if number.length


    /* POMOCNE FUNKCIJE */

    function podnozjeIKraj(odgovor){
        render.prikazi("footer", {}, odgovor);
        odgovor.end();
    }   // podnozjeIKraj

    function prikaziGresku(odgovor, error){
        render.prikazi("error", {errorMessage: error.message}, odgovor);
        render.prikazi("search", {}, odgovor);
    }   // prikaziGresku

    function prikaziProfil(odgovor, podaci){
        var vrednosti = {
            number: podaci.id,
            naslov: podaci.title,
            ceo: podaci.body
        };
        render.prikazi("sentence", vrednosti, odgovor);
    }   // prikaziProfil

}   // prihvatiRute


module.exports.prihvati = prihvatiRute;
