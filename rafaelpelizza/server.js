// Dependências
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

// Path
let path = require('path');
let public = path.resolve(__dirname, 'public');
let dev = path.resolve(__dirname, 'dev');

// MongoDB
let dbURI = 'mongodb://rafaelpelizza:theos123@ds153460.mlab.com:53460/theos';
mongoose.connect(dbURI, {auto_reconnect:true});
let db = mongoose.connection;

// Tratamento conexão BD
db.on('error', console.error.bind(console, 'Ocorreu um erro de conexão'));
db.once('open', () => {
	console.log('mongodb conectado com sucesso');
});

// Express
let app = express();
app.use(express.static(public));
// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/index.html');
// });
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/angular/index.html');
});
app.get('/dev', (req, res) => {
	res.sendFile(__dirname + '/dev/html_base/base.html');
});
app.get('/ng', (req, res) => {
	res.sendFile(__dirname + '/public/angular/index.html');
});
app.get('/vue', (req, res) => {
	res.sendFile(__dirname + '/public/vuejs/index.html');
});

// remover dpois
app.get('/ng/base', (req, res) => {
	res.sendFile(__dirname + '/public/angular/base.html');
});
app.get('/vue/base', (req, res) => {
	res.sendFile(__dirname + '/public/vuejs/base.html');
});
// 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rotas
app.use('/api', require('./app/routes/api'));

// Servidor
app.listen(3000, () => console.log('Server Up'));