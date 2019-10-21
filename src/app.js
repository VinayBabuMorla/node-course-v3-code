const path = require('path');
const express = require('express');
const chalk = require('chalk');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forcast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000
//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Vinay'
    });
});


// app.get('', (req, res) => {
//     res.send('<h1>Hello Express!</h1>');
// });

// app.get('/help', (req, res) => {
//     res.send({
//         name: 'vinay',
//         age: 29
//     });
// });

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'vinay'
    });
});

// app.get('/about', (req, res) => {
//     res.send('<h1>About Express!</h1>');
// });

//Dynamic values to html
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Vinay'
    });
});


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forcast(latitude, longitude, (error, forcastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                forcast: forcastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    console.log(req.query.search);
    if (!req.query.search) {
        return res.send({
            error: 'You must provide seach term!'
        });
    }
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Error',
        errorMessage: 'Help artical not found!',
        name: 'Vinay'
    })
});

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error',
        errorMessage: '404 Page not found!',
        name: 'Vinay'
    })
});
//To start server
app.listen(port, () => {
    console.log(chalk.green.inverse('Server starts on port ' + port));
});