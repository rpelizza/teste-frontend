angular.module('theos', []).controller('theosCtrl', ['$scope', '$http', function($scope, $http) {

	// Config e Vars
	$scope.profissoes = [];
	$scope.cidades_estados = [];
	$scope.loading = true;
	$scope.modalTitle = '';

	$scope.lista_profissoes = [
		{cod: 1, nome: 'Administrador'},
		{cod: 2, nome: 'Bioquímico'},
		{cod: 3, nome: 'Chaveiro'},
		{cod: 4, nome: 'Dentista'},
		{cod: 5, nome: 'Economista'},
		{cod: 6, nome: 'Farmacêutico'},
		{cod: 7, nome: 'Geólogo'},
		{cod: 8, nome: 'Ilustrador'},
		{cod: 9, nome: 'Nutricionista'},
		{cod: 10, nome: 'Programador'}
	]

	$scope.profissional = {
		_id: 0,
		nome: '',
		sobrenome: '',
		email: '',
		sexo: 'Masculino',
		estado: '',
		cidade: '',
		area_formacao: ''		
	}

	modal = document.getElementById('modal_cadastro');	
	api = 'http://localhost:3000/api/profissao';

	// Pesquisa
	$scope.search = function(item) {
		if ($scope.pesquisa == undefined) {
			return true;
		} else {
			if (item.nome.toLowerCase().indexOf($scope.pesquisa.toLowerCase()) != -1 ||  item.sobrenome.toLowerCase().indexOf($scope.pesquisa.toLowerCase()) != -1 || item.profissao.toLowerCase().indexOf($scope.pesquisa.toLowerCase()) != -1) {
				return true;
			}
		}

		return false;
	}


	// Cidades e estados
	$http({
		method: 'GET',
		url: 'http://localhost:3000/assets/json/cidadesestados.json'
	}).then(function(resp){
		$scope.cidades_estados = resp.data;
		$scope.profissional.estado = $scope.cidades_estados[0];
		$scope.profissional.cidade = $scope.profissional.estado.cidades[0];
	}, function(err){
		console.log(err);
	});	

	$scope.setCidadeFirst = function() {
		$scope.profissional.cidade = $scope.profissional.estado.cidades[0];
	}


	// api fn
	$scope.requisicao = function(type, id, data) {
		console.log(type, id, data);
		$scope.loading = true;
		var tipo = ((type == undefined || type == null) && (data == undefined || data == null)) ? 'GET' : type;
		var config = {
			method: tipo,
			url: (id == undefined || id == null) ? api : (api + '/' + id),
			data: data,
			headers: {
			   'Content-Type': 'application/json'
			},
		}
		$http(config).then(function(resp){
			$scope.loading = false;
			if (resp.data.message == 'success') {
				switch (tipo) {
					case 'DELETE':
						$scope.profissoes = $scope.profissoes.filter(function(p) {
							return p._id != id;
						})
						break;
					case 'POST':
						var profissoes = $scope.profissoes;
						profissoes.push(resp.data.data);
						$scope.profissoes = profissoes;
						break;
					case 'PUT':
						var indexProfissional = $scope.profissoes.findIndex(function(p) {
							return p._id == id;
						});
						$scope.profissoes[indexProfissional].area_formacao = resp.data.data.area_formacao;
						$scope.profissoes[indexProfissional].cidade = resp.data.data.cidade;
						$scope.profissoes[indexProfissional].email = resp.data.data.email;
						$scope.profissoes[indexProfissional].estado = resp.data.data.estado;
						$scope.profissoes[indexProfissional].nome = resp.data.data.nome;
						$scope.profissoes[indexProfissional].profissao = resp.data.data.profissao;
						$scope.profissoes[indexProfissional].sexo = resp.data.data.sexo;
						$scope.profissoes[indexProfissional].sobrenome = resp.data.data.sobrenome;
						break;
					default:
						$scope.profissoes = resp.data.data;
						break;
				}
			}
		}, function(err){
			console.log(err);
		});
	}

	// Salvar novo profissional / alterações
	$scope.salvarProfissional = function() {
		$scope.loading = true;
		$scope.profissional.profissao = $scope.profissional.profissao.nome;
		$scope.profissional.estado = $scope.profissional.estado.sigla;
		var dados = angular.copy($scope.profissional);
		
		if ($scope.profissional._id == 0) {
			delete dados._id;
			$scope.requisicao('POST', null, dados);
			$scope.closeModal();
		} else {
			$scope.requisicao('PUT', $scope.profissional._id, dados);
			$scope.closeModal();
		}
	}

	// Editar
	$scope.editar = function(id) {
		$scope.modalTitle = 'Editar cadastro';
		modal.classList.remove('fechar');
		modal.classList.add('abrir');

		var profissional = $scope.profissoes.filter(function(user) {
			return user._id == id;
		});

		var iEstado = $scope.cidades_estados.findIndex(function(x) {
			return x.sigla == profissional[0].estado;
		});

		var iCidade = $scope.cidades_estados[iEstado].cidades.findIndex(function(z) {
			return z == profissional[0].cidade;
		})

		var iProfissao = $scope.lista_profissoes.findIndex(function(a) {
			return a.nome == profissional[0].profissao;
		});

		$scope.profissional._id = profissional[0]._id;
		$scope.profissional.nome = profissional[0].nome;
		$scope.profissional.sobrenome = profissional[0].sobrenome;
		$scope.profissional.email = profissional[0].email;
		$scope.profissional.sexo = profissional[0].sexo;

		$scope.profissional.estado = $scope.cidades_estados[iEstado];
		$scope.profissional.cidade = $scope.profissional.estado.cidades[iCidade];

		$scope.profissional.area_formacao = profissional[0].area_formacao;
		$scope.profissional.profissao = $scope.lista_profissoes[iProfissao];	
	}

	// Novo cadastro
	$scope.novoCadastro = function() {
		$scope.modalTitle = 'Novo profissional';
		$scope.profissional._id = 0;
		modal.classList.remove('fechar');
		modal.classList.add('abrir');
	}

	// fechar o modal
	$scope.closeModal = function() {
		modal.classList.remove('abrir');
		modal.classList.add('fechar');
		$scope.profissional._id = 0;
		$scope.profissional.nome = '';
		$scope.profissional.sobrenome = '';
		$scope.profissional.email = '';
		$scope.profissional.sexo = 'Masculino';
		$scope.profissional.estado = $scope.cidades_estados[0];
		$scope.profissional.cidade = $scope.profissional.estado.cidades[0];
		$scope.profissional.area_formacao = '';
		delete $scope.profissional.profissao;		
	}


	$scope.requisicao();

}]).directive('loading', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<p class="loading"><img src="../assets/img/loading.gif"/></p>', 
        link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                val = val ? $(element).show() : $(element).hide();
            }); 
        }
    }
}).filter('formatarData', function() {
	return function(input) {
		var data = new Date(input);
		var horas = data.getHours() < 10 ? ('0'+data.getHours()) : data.getHours();
		var minutos = data.getMinutes() < 10 ? ('0'+data.getMinutes()) : data.getMinutes()
		return new Date(input).toLocaleDateString() + ' - ' + horas+':'+minutos
 	}
});