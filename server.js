require('dotenv').config(); // read .env files

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Express Error Handler 
const errorHandler = (err, req, res) => {
    if(err.reponse){
        // The request was and the server responded with a status code
        // that falls out of the range 2xx
        res.status(403).send({title: 'Server responded with an error', message: err.message});
    }
}

// Fetch latest currency rates
app.get('/api/rates', async(req,res) => {
    try{
        const data = await getRates();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }catch(error){
        errorHandler(error,req,res);
    }
});

// Redirect all traffic to index.html
app.use((req,res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
    console.log('listening on %d', port);
});

const { getRates } = require('./lib/fixer-service');




// const test = async() => {
//     const data = await getRates();
//     console.log(data);
// }

// test();

