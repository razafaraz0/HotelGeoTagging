// Sample Run for Back-End
//1) type node index.js
//2) type 'localhost:3000/restaurants?alt=40.74917,-73.98529' on webbrower to get a list to location at this server

const express = require('express')
const app = express()
const axios = require('axios');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var server = app.listen(3000, function (){
    var host = server.address().address
    var port = server.address().port

    console.log("listening at http://localhost%s%s", host, port);
})
app.get('/', (req, res) => {
    res.send('App Connected')
})

app.get('/hotels', (req, res) => {
    const alt = req.query.alt;
    axios.get('https://discover.search.hereapi.com/v1/discover?at='+alt+'&q=hotels&apiKey=d6P_iT9IijO82t-OTwt_mUpiFyIodK3JJqV9msKJuqk')
        .then(response => {var array =response.data.items;
            return res.status(200).send(array);
        })
        .catch(error => {
            console.log(error);
        });
})