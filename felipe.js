// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoBooks = require('./models/mongoBooks');
var mongoUsers = require('./models/mongoUsers');
//var mongoOp2 = require('./models/mongo2');  // ARQUIVO RELACIONADO A OUTRO DB

// comente as duas linhas abaixo
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use('/', express.static(__dirname + '/'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...

// comente as duas linhas abaixo
// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

// error handler
app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
 res.status(err.status || 500);
 res.render('error');
});

module.exports = app;



function checkAuth(req, res) {
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  if(key != '') return true;
  res.json({'resultado': 'Clique em LOGIN para continuar'});
  return false;
}

function returnUser(req,res){
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  return key
}

// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

/**
**    REQUISIÇÕES HTTP PARA OS LIVROS
**
**
**/

// index.html
router.route('/')
 .get(function(req, res) {  // GET
     var path = 'index.html';
     res.sendfile(path, {"root": "./"});
     console.log(req.path);
     console.log(JSON.stringify(req.body));
  }
 );

router.route('/books')   // operacoes sobre todos os exemplares
 .get(function(req, res) {  // GET
   if(! checkAuth(req, res)) return;
   var response = {};

   console.log(req.path);
   console.log(JSON.stringify(req.body));

   mongoBooks.find({}, function(erro, data) {
      if(erro)
         response = {"resultado": "Falha de acesso ao BD"};
       else
         response = {"livros": data};

         res.json(response);
       }
     )
   }
 )
 .post(function(req, res) {   // POST (cria)
    var query = {"title": req.body.title};
    if(! checkAuth(req, res)) return;
    var response = {};

    console.log(req.path);
    console.log(JSON.stringify(req.body));
    console.log(query);

    mongoBooks.findOne(query, function(erro, data) {

       if (data == null) {
          var db = new mongoBooks();
          db.owner = req.body.owner;
          db.title = req.body.title;

          db.save(function(erro) {
            if(erro) {
                response = {"resultado": "Falha de insercao no BD"};
                res.json(response);
            } else {
                response = {"resultado": "Livro inserido no BD"};
                res.json(response);
             }
           }
         )
       } else {
           response = {"resultado": "Livro ja existente"};
           res.json(response);
         }
       }
     )
   }
 );


router.route('/books/:title')   // operacoes sobre um livro
 .get(function(req, res) {   // GET
    if(! checkAuth(req, res)) return;
     var response = {};
     var query = {"title": req.params.title};

     console.log(req.path);
     console.log(JSON.stringify(req.body));
     console.log(query);

     mongoBooks.findOne(query, function(erro, data) {

        if(erro) {
           response = {"resultado": "falha de acesso ao BD"};
           res.json(response);
        } else if (data == null) {
           response = {"resultado": "livro inexistente"};
           res.json(response);
        } else {
           response = {"livros": [data]};
           res.json(response);
         }
       }
     )
   }
 )
 .put(function(req, res) {   // PUT (altera)
   if(! checkAuth(req, res)) return;
     var response = {};
     var query = {"title": req.params.title};
     var data = {"title": req.params.title, "owner": req.body.owner};

     console.log(req.path);
     console.log(JSON.stringify(req.body));
     console.log(query);

     mongoBooks.findOneAndUpdate(query, data, function(erro, data) {

         if(erro) {
           response = {"resultado": "falha de acesso ao DB"};
           res.json(response);
         } else if (data == null) {
            response = {"resultado": "livro inexistente"};
            res.json(response);
         } else {
            response = {"resultado": "livro atualizado no BD"};
            res.json(response);
   }
       }
     )
   }
 )
 .delete(function(req, res) {   // DELETE (remove)
   if(! checkAuth(req, res)) return;
    var response = {};
    var query = {"title": req.params.title};

    console.log(req.path);
    console.log(JSON.stringify(req.body));
    console.log(query);
    mongoBooks.findOneAndRemove(query, function(erro, data) {

        if(erro) {
           response = {"resultado": "falha de acesso ao DB"};
           res.json(response);
        }else if (data == null) {
            response = {"resultado": "livro inexistente"};
            res.json(response);
           } else {
             response = {"resultado": "livro removido do BD"};
             res.json(response);
            }
         }
       )
   }
 );


/*--------------USER SIGNUP--------------*/

router.route('/usersignup')   // operacoes sobre todos os exemplares
  //abre a página
  .get(function(req, res) {  // GET
    var path = 'signup.html';
    res.header('Cache-Control', 'no-cache');
    res.sendfile(path, {"root": "./"});
  }
  )

    //sign up
    .post(function(req, res) {   // POST (cria)
    //if(checkAuth(req, res)) return;
      console.log(JSON.stringify(req.body));
      var user = req.body.user;
      var pass = req.body.password;
      var query = {"user": user}
      var response = {};

      mongoUsers.findOne(query, function(erro, data) {
        console.log(data);

         if (data == null) {
            var db = new mongoUsers();
            db.user =  req.body.user;
            db.password = req.body.password;

            db.save(function(erro) {
              if(erro) {
                  response = {"resultado": "Falha de cadastro do usuario"};
                  res.json(response);
              } else {
                  response = {"resultado": "Usuario cadastrado"};
                  res.json(response);
               }
             }
           )
         } else {
             response = {"resultado": "Usuario ja existente"};
             res.json(response);
           }
         }
       )
    }
    )

    //Remove usuario
    .delete(function(req, res) {   // POST (cria)
    if(!checkAuth(req, res)) return;
    user = returnUser(req, res);
    console.log (user);
      var query = {"user": user}
      var response = {};

      mongoUsers.findOneAndRemove(query, function(erro, data) {
          if(erro) {
             response = {"resultado": "falha de acesso ao DB"};
             res.json(response);
          }else if (data == null) {
              response = {"resultado": "Usuario inexistente"};
              res.json(response);
             } else {
               response = {"resultado": "Usuario removido"};
               res.json(response);
              }
           }
         )
    }
    );


/*--------------USER SIGNIN--------------*/

router.route('/authentication')   // autenticação
  .get(function(req, res) {  // GET
     var path = 'auth.html';
     res.header('Cache-Control', 'no-cache');
     res.sendfile(path, {"root": "./"});
     }
  )
  .post(function(req, res) {
     console.log(JSON.stringify(req.body));
     var user = req.body.user;
     var pass = req.body.password;
     var query = {"user": user}


     console.log(pass);
     console.log(req.body.password);

     // verifica usuario e senha na base de dados
     mongoUsers.findOne(query, function(erro, data) {
       console.log(data);
       console.log(data.password);

        if (data == null) {
          response = {"resultado": "Usuario nao existente"};
          res.json(response);
        } else {
            if(data.password == pass){
              res.cookie('EA975', user, {'maxAge': 3600000*24*5});
              response = {"resultado": "Usuario logado com sucesso"};
              res.json(response);
            }else{
              response = {"resultado": "Usuario ou senha inválidos"};
              res.json(response);
            }
          }
        }
      )
    }
  )

  .delete(function(req, res) {
      if(! checkAuth(req, res)) return;
     res.clearCookie('EA975');	 // remove cookie no cliente
     res.json({'resultado': 'Sucesso'});
     }
  );
