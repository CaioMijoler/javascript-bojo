var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var core_use = require('cors');
var pg = require('pg');
var session = require('express-session');

var sess;
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/fronts/views');
app.set('view engine', 'html');
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/fronts', express.static(__dirname + '/fronts'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

app.use(core_use());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var config = {
	user: "postgres",
	database: "TISI",
	password: "mva7155",
	port: 5432,
	max: 10,
    idleTimeoutMills: 30000
}

var canal = new pg.Pool(config);

//===================================
//-------------- TELAS --------------
//===================================

// encerra sessão
app.get('/logout',function(req,res){		
	req.session.destroy(function(err){		
		if (err) {			
			console.log(err);		
		}	
	});
	res.redirect('/login');
});


// telas quer precisam de login



app.get('/login',function(req,res){
	res.render('login.html');
});

app.get('/menu',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('menu.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/tela',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('tela.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/custo',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('custo.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/pedido',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('pedido.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/novo',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('novo.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/Materia_Prima',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Materia_Prima.html');
    } 
    else {
    	res.render('login.html');
    } 
});

//Método para Login
app.post('/logar', function (req, res) {
	var sess = req.session;
	canal.connect(function (erro, conexao, finalizado) {
		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}
		var sql = 'SELECT COUNT(*) as valor '
			+ 'FROM TB_EMPRESA '
			+ 'WHERE EMAIL = \'' + req.body.email + '\' '
			+ 'AND SENHA = MD5(\'' + req.body.senha + '\'); ';
		
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro logar ', erro);
				res.status(400).send(erro).end();
			}
			var valor = resultado.rows[0].valor;
			if( valor == 1){
				sess.email = req.body.email;
			}
			res.json(valor).end();
		});
	});
});
//=============================================================

//Método para cadastrar CUSTO
app.put('/putCusto', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}
		var sql = `
			 	 UPDATE TB_CUSTO 
					SET valor_tecido = ${req.body.valor_tecido},
						valor_espuma = ${req.body.valor_espuma}
			 	  WHERE id_custo = ${req.body.id_custo};
			`;

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro putCusto ', erro);
				res.status(400).send(erro).end();
			}
			res.sendStatus(200).end();
		});
	});
});
//=============================================================

//Método para consultar CUSTO
app.get('/getCusto', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}

		var sql = `
				SELECT ID_CUSTO, VALOR_TECIDO, VALOR_ESPUMA 
				  FROM TB_CUSTO;
			`;

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro getCusto ', erro);
				res.status(400).send(erro).end();
			}

			resultado.rows[0].valor_tecido = parseFloat(resultado.rows[0].valor_tecido);
			resultado.rows[0].valor_espuma = parseFloat(resultado.rows[0].valor_espuma);

			res.json(resultado.rows[0]).end();
		});
	});
});

//Método para cadastrar NOVO
app.post('/cadastrarNovo', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {
		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}
		var sql = 'INSERT INTO TB_NOVO(ID_NOVO, DT_NOVO, PRODUTO_NOVO, QUANTIDADE_NOVO, NUMERO_NOVO, COR)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.dt_novo + '\',\'' +
			req.body.produto_novo + '\', ' +
			req.body.quantidade_novo + ',' +
			req.body.numero_novo +  ',\'' +
			req.body.cor + '\');';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro cadastrarNovo ', erro);
				res.status(400).send(erro).end();
			}
			res.sendStatus(200).end();
		});
	});
});//=============================================================

//Método para consultar NOVO
app.get('/consultaNovo', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}

		var sql = '\nSELECT ID_NOVO, DT_NOVO, PRODUTO_NOVO, QUANTIDADE_NOVO, NUMERO_NOVO, COR'
				+ '\nFROM TB_NOVO '
				+ '\nORDER BY ID_NOVO;';

		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro ao consultaNovo ', erro);
				res.status(400).send(erro).end();
			}
			res.json(resultado.rows).end();
		});
	});
});
app.get('/consultaCusto', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {
		
		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}

		var sql = `
	SELECT COR,
		TOTAL, 
		TOTAL_PLACAS, 
		TOTAL_PLACAS*1.2 AS VALOR_ESPUMA, 
		TOTAL_PLACAS*0.4 AS VALOR_TECIDO, 
		ROUND(TOTAL_PLACAS*1.2 * (SELECT VALOR_ESPUMA FROM TB_CUSTO), 4) AS CUSTO_ESPUMA,
		ROUND(TOTAL_PLACAS*0.4 * (SELECT VALOR_TECIDO FROM TB_CUSTO), 4) AS CUSTO_TECIDO
	FROM (
		SELECT COR, TOTAL, ROUND(((TOTAL_MARGEM - MOD(TOTAL_MARGEM, 8)) / 8 + 1), 0) AS TOTAL_PLACAS
		FROM (
			SELECT COR, TOTAL, (TOTAL*1.1) AS TOTAL_MARGEM
			FROM (
				SELECT COR, SUM(CAST(QUANTIDADE_NOVO AS NUMERIC)) AS TOTAL
				FROM TB_NOVO
				GROUP BY COR
			) AS PEDIDO
		) AS PLACAS
	) AS CUSTO;
				`;
					
		console.log(sql);
		
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro consulta custo!', erro);
				res.status(400).send(erro).end();
			}
			res.json(resultado.rows).end();
		});
	});
});

app.get('/consultaMateriaPrima', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			console.error('Erro ao conectar ao Banco de Dados', erro);
			res.status(400).send(erro).end();
		}

		var sql = '';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				console.error('Erro consulta materia prima !', erro);
				res.status(400).send(erro).end();
			}
			res.json(resultado.rows).end();
		});
	});
});
//=============================================================
app.listen(3000, function () {
	console.log("SERVIDOR escutando na porta 3000");
})