const axios = require('axios');


var getTemperature = (lat, lng) => {



    var url = `https://api.darksky.net/forecast/90ed774613b6cd56ad3b3078a7350af6/${lat},${lng}`;

    return axios.get(url).then((body) => {

        return body;

    }).catch((error) => {

        if (error.code === 'ENOTFOUND')
            console.log(`unable to coonect to API ${error.code}`);
        else
            console.log(`there is an error ${error.message}`);
    });

};

module.exports = { getTemperature }