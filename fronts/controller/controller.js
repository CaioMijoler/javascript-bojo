var controller = angular.module('Controller', ['ngCookies','ngMaterial', 'ngMessages']);

controller.controller('Controller', function ($scope, $http, $cookies) {

    var consultaUsuario = function () {
        $http.post('http://localhost:3000/logar', $scope.login)
        .then(function (response) {
            if (response.data > 0) {
                //alert("Login feito com Sucesso!!!");
                $cookies.put('email1', $scope.login.email, {'domain': 'localhost'}); 
                window.location.href = "http://localhost:3000/tela";
            }
            else {
                alert("Email ou Senha inválido, tente novamente!!!");
            }
        });
    };   
    $scope.iniciarNovo = function () {
        $scope.novo = {
            produto_novo: 'Bojo',
            cor: 'Azul',
            dt_novo: new Date(),
            quantidade_novo: 0,
            numero_novo: 0
        }
    }

    var cadastarNovo = function () {
        $http.post('http://localhost:3000/cadastrarNovo', $scope.novo)
        .then(function (response) {
            alert("Cadastro realizado com Sucesso !!!");
        });
    };

    var formataData = function (data) {
        data = new Date(data);
        var dia = data.getDate().toString();
        var mes = (data.getMonth() + 1).toString();
        var ano = data.getFullYear().toString();

        return (dia.length == 1 ? '0'+dia : dia) + '/' + (mes.length == 1 ? '0'+mes : mes) + '/' + ano;
    }

    var consultarNovo = function () {
        $http.get('http://localhost:3000/consultaNovo')
        .then(function (response) {
            response.data.forEach(element => {
                element.dt_novo_string = formataData(element.dt_novo);
            });
            $scope.novo = response.data;
        }).catch(function (err) {
            console.error(err);
        });
    };
    
    $scope.consultarCusto = function () {
        $http.get('http://localhost:3000/consultaCusto')
        .then(function (response) {
            $scope.custos = response.data;

            $scope.total_mp = 0;
            $scope.espuma = {
                'qtd_espuma': 0,
                'tot_custo_espuma': 0
            };

            $scope.custos.forEach(function(element){
                $scope.total_mp += parseFloat(element.custo_tecido) + parseFloat(element.custo_espuma);
                $scope.espuma.qtd_espuma = parseFloat(Math.round((parseFloat($scope.espuma.qtd_espuma) + parseFloat(element.valor_espuma))*1000)/1000);
                $scope.espuma.tot_custo_espuma = parseFloat(Math.round((parseFloat($scope.espuma.tot_custo_espuma) + parseFloat(element.custo_espuma))*1000)/1000);
            });

            $scope.verba_mp = parseFloat(Math.round($scope.total_mp*0.1*1000)/1000);
            $scope.custo_mp = parseFloat(Math.round($scope.total_mp*0.3*1000)/1000);
            $scope.custo_total = parseFloat(Math.round($scope.total_mp) + (Math.round($scope.custo_mp) +(Math.round($scope.verba_mp)))) ;
            $scope.custo_produto = parseFloat(Math.round($scope.custo_total/(parseFloat($scope.espuma.qtd_espuma))));
        });
       
    };

    //=========CUSTO==============================
    $scope.init = function(){
        getCusto();
    }

    var getCusto = function(){
        $http.get('http://localhost:3000/getCusto')
        .then(function (response) {
            $scope.custo = response.data;
        });
    }
    
    $scope.atualizaCusto = function(){
        $http.put('http://localhost:3000/putCusto', $scope.custo)
        .then(function (response) {
            getCusto();
            alert("Atualizado com sucesso");
        });
    }
    //=========MATERIA PRIMA=========================
    var getMateriaPrima = function () {
        $http.get('http://localhost:3000/getMateriaPrima')
        .then(function (response) {
            $scope.mp = response.data;
        });
    };
    $scope.atualizaMateriaPrima = function () {
        $http.put('http://localhost:3000/putMateriaPrima')
        .then(function (response) {
            $scope.mp = response.data;
        });
    };

    //==================================================================

    $scope.entrar = function () {
        consultaUsuario();
    };
  
    $scope.cadastroNovo = function () {
        cadastarNovo();
    };

    $scope.consultaNovo = function () {
        consultarNovo();
    };

    $scope.receber = function () {
		if (angular.isDefined($cookies.get('email1'))){
			console.log('Bem vindo: ' + $cookies.get('email1'));
			$scope.usuario = $cookies.get('email1');
		}
	};
	$scope.logout = function () {
		$cookies.remove('email1')
		window.location.href = '/logout';
    }
});
   

