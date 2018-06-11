// Dependências
let restful = require('node-restful');
let mongoose = restful.mongoose;

// Schema
let profissaoSchema = new mongoose.Schema({
	nome: String,
	sobrenome: String,
	email: String,
	sexo: String,
	estado: String,
	cidade: String,
	area_formacao: String,
	profissao: String,
	date: {
    	type: Date,
    	default: Date.now
    }
})

// Retorno da model
module.exports = restful.model('Profissao', profissaoSchema);