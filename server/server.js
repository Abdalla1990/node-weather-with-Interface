var { Mongoose } = require('./db/connection.js');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var { address } = require('./modules/address');
var google = require('./../server/api/google');
var darksky = require('./../server/api/darksky');
var Address;
const port = process.env.PORT || 3000;

var app = express();
app.set('view engin', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/displayAddress', (req, res) => {

    //console.log(req.body);
    Address = req.body.address;
    //console.log('server : ', Address);



    google.getAddress(Address).then((body) => {
        //console.log('server : ', Address);
        //console.log('google : ', body.data.results[0].formatted_address);
        if (!body) return console.log('unable to find response!');
        if (body === 'there is an error Unable to find that address.') { throw new Error('Unable to find that address.') };

        console.log(body);

        var formatted_address = body.data.results[0].formatted_address;
        var latitude = body.data.results[0].geometry.location.lat;
        var lngtitude = body.data.results[0].geometry.location.lng;

        darksky.getTemperature(latitude, lngtitude).then((temp) => {
            var ad = new address({
                address: formatted_address,
                lat: latitude,
                lng: lngtitude,
                temp: temp.data.currently.temperature
            });
            ad.save().then((doc) => {
                res.render('address.hbs', {
                    address: formatted_address,
                    lat: latitude,
                    lng: lngtitude,
                    temp: temp.data.currently.temperature
                }).status(200).send(doc);

            }, (err) => {
                res.status(400).send(err);
            });
        }), (err) => { res.send(err); };



    }).catch((error) => {
        if (error.code === 'ENOTFOUND')
            res.send(`unable to coonect to API ${error.code}`);
        else
            res.send(`there is an error ${error.message}`);
    })

});


app.get('/', (req, res) => {

    res.render('home.hbs', {});

});

app.listen(port, () => {
    console.log(`started at ${port} .`)
});






module.exports = { Address }