 // Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoBooks = require('./models/mongoBooks');
var mongoTrade = require('./models/mongoTrade'); 

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
    var response = {};

    console.log(req.path);
    console.log(JSON.stringify(req.body));

    mongoBooks.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"books": data};
          
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"title": req.body.title};
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
                 response = {"resultado": "Falha de inserção no BD."};
                 res.json(response);
             } else {
                 response = {"resultado": "Livro inserido corretamente."};
                 res.json(response);
              }
            }
          )
        } else {
            response = {"resultado": "Livro já existente."};
            res.json(response);
          }
        }
      )
    }
  );

router.route('/books/:title')   // operacoes sobre um livro
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"title": req.params.title};

      console.log(req.path);
      console.log(JSON.stringify(req.body));
      console.log(query);

      mongoBooks.findOne(query, function(erro, data) {
       
         if(erro) {
            response = {"resultado": "Falha de acesso ao BD."};
            res.json(response);
         } else if (data == null) {
            response = {"resultado": "Livro inexistente."};
            res.json(response);   
         } else {
            response = {"books": [data]};
            console.log(response);
            res.json(response);

          }
        }
      )
    
      
    }
  )
  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"title": req.params.title};
      var data = {"title": req.params.title, "owner": req.body.owner};

      console.log(req.path);
      console.log(JSON.stringify(req.body));
      console.log(query);

      mongoBooks.findOneAndUpdate(query, data, function(erro, data) {
          
          if(erro) {
            response = {"resultado": "Falha de acesso ao BD!"};
            res.json(response);
          } else if (data == null) { 
             response = {"resultado": "Livro inexistente."};
             res.json(response);   
          } else {
             response = {"resultado": "Livro atualizado."};
             res.json(response);   
    }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
     var response = {};
     var query = {"title": req.params.title};

     console.log(req.path);
     console.log(JSON.stringify(req.body));
     console.log(query);
     mongoBooks.findOneAndRemove(query, function(erro, data) {
       
         if(erro) {
            response = {"resultado": "Falha de acesso ao BD!"};
            res.json(response);
         }else if (data == null) {        
             response = {"resultado": "Livro inexistente."};
             res.json(response);
            } else {
              response = {"resultado": "Livro removido do seu inventório."};
              res.json(response);
             }
          }
        )
    }
  );

router.route('/trade')   // operacoes sobre todos os exemplares
  .get(function(req, res) {  // GET

    console.log(req.path);
    console.log(JSON.stringify(req.body));

    mongoTrade.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD!"};
        else
          response = {"Trocas": data};
          
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"idTrade": req.body.idTrade};
     var response = {};

     console.log(req.path);
     console.log(JSON.stringify(req.body));
     console.log(query);

     mongoTrade.findOne(query, function(erro, data) {
      
        if (data == null) {
           var db = new mongoTrade();
           db.idTrade = req.body.idTrade;
           db.UserReq = req.body.UserReq;
           db.UserResp = req.body.UserResp;
           db.titleBook = req.body.titleBook;    

           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de insercao no BD."};
                 res.json(response);
             } else {
                 response = {"resultado": "Troca inserida no BD."};
                 res.json(response);
              }
            }
          )
        } else {
            response = {"resultado": "Troca já existente."};
            res.json(response);
          }
        }
      )
    }
  );
