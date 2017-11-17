const axios = require('axios');




var getAddress = (add) => {
    if (!add) { add = 'montreal' }
    var encodedAddress = encodeURIComponent(add);
    // console.log('address from server : ' + encodedAddress);
    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;


    return axios.get(url).then((response) => {


        if (!response) return console.log('unable to find response!');
        if (response.data.status === 'ZERO_RESULTS') { throw new Error('Unable to find that address.') }
        // console.log(` from google ================================`);
        // console.log(`address      :  ${response.data.results[0].formatted_address}`);
        // console.log(`latitude     :  ${response.data.results[0].geometry.location.lat}`);
        // console.log(`langtitude   :  ${response.data.results[0].geometry.location.lng}`);
        // console.log(add);


        return response;


    }).catch((error) => {

        if (error.code === 'ENOTFOUND')
            return `unable to coonect to API ${error.code}`;
        else
            return `there is an error ${error.message}`;
    });

};

module.exports = { getAddress }