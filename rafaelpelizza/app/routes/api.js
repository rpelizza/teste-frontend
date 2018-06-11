// Dependências
let express = require('express');
let router = express.Router();

// Models
let Profissao = require('../models/profissao');

// Rotas
Profissao.methods(['get', 'post', 'put', 'delete']);


// Tratamento para o método GET
Profissao.after('get', (req, res, next) => {
	let status = res.locals.status_code;
	switch (status) {
		case 200:
			res.json({message: 'success', data: res.locals.bundle});
			break;
		case 404:
			res.json({message: 'not_found', cod: status});
			break;
		default:
			res.json({message: 'error', cod: status});
			break;
	}
});

// Tratamento para o método POST
Profissao.after('post', (req, res, next) => {
	let status = res.locals.status_code;
	switch (status) {
		case 201:
			res.json({message: 'success', data: res.locals.bundle});
			break;
		default:
			res.json({message: 'error', cod: status});
			break;
	}
});


// Tratamento para o método PUT
Profissao.after('put', (req, res, next) => {
	let status = res.locals.status_code;
	switch (status) {
		case 200:
			res.json({message: 'success', data: req.body});
			break;
		case 404:
			res.json({message: 'not_found', cod: status});
			break;
		default:
			res.json({message: 'error', cod: status});
			break;
	}
});

// Tratamento para o método DELETE
Profissao.after('delete', (req, res, next) => {
	let status = res.locals.status_code;
	switch (status) {
		case 204:
			res.json({message: 'success'});
			break;
		case 404:
			res.json({message: 'not_found', cod: status});
			break;
		default:
			res.json({message: 'error', cod: status});
			break;
	}
});

Profissao.register(router, '/profissao');

// Retorno da rota
module.exports = router;