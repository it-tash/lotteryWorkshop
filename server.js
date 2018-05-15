const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('express-favicon');
const db = require('./db').db;
const addrAbiObj = require('./abi').addrAbiObj;

const app = express();





app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(bodyParser.json()); // req.body axios

app.use(express.static(path.join(__dirname, 'public')));

// app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/init', (req, res) => {
    res.send(addrAbiObj);
});


app.post('/pass', (req, res)=>{
    const pasInp = req.body.pasInp;
    let passApr = false;
    db.map(pass=>{
        if (pasInp === pass) {passApr = true;}
    });
    res.send(passApr);
});



app.use((req, res, next) => {
    res.status(404);
    res.render('404');
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//************************* Запуск сервера ***********************************
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);


httpServer.listen(PORT, ()=>console.log('listening on ', PORT,'...'));





