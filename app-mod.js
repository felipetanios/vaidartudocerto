 // Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOp = require('./models/mongo');

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

// index.html
router.route('/') 
  .get(function(req, res) {  // GET
      var path = 'index.html';
      res.sendfile(path, {"root": "./"});
   }
  );

router.route('/exemplares')   // operacoes sobre todos os exemplares
  .get(function(req, res) {  // GET
    var response = {};
    mongoOp.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"exemplares": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"id": req.body.id};
     var response = {};
     mongoOp.findOne(query, function(erro, data) {
        if (data == null) {
           var db = new mongoOp();
           db.id = req.body.id;
           db.title = req.body.title;
           db.author = req.body.author;
	   db.area = req.body.area;
           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de insercao no BD"};
                 res.json(response);
             } else {
                 response = {"resultado": "Exemplar inserido no BD"};
                 res.json(response);
              }
            }
          )
        } else {
	    response = {"resultado": "Exemplar ja existente"};
            res.json(response);
          }
        }
      )
    }
  );


router.route('/exemplares/:id')   // operacoes sobre um aluno (RA)
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"id": req.params.id};
      mongoOp.findOne(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
         } else if (data == null) {
             response = {"resultado": "exemplar inexistente"};
             res.json(response);   
	 } else {
	    response = {"exemplares": [data]};
            res.json(response);
           }
        }
      )
    }
  )
  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"id": req.params.id};
      var data = {"title": req.body.title, "author": req.body.author};
      mongoOp.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	  } else if (data == null) { 
             response = {"resultado": "exemplar inexistente"};
             res.json(response);   
          } else {
             response = {"resultado": "exemplar atualizado no BD"};
             res.json(response);   
	  }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
     var response = {};
     var query = {"id": req.params.ra};
      mongoOp.findOneAndRemove(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	 } else if (data == null) {	      
             response = {"resultado": "exemplar inexistente"};
             res.json(response);
            } else {
              response = {"resultado": "exemplar removido do BD"};
              res.json(response);
	   }
         }
       )
     }
  ); // Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOp = require('./models/mongo');

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

// index.html
router.route('/') 
  .get(function(req, res) {  // GET
      var path = 'index.html';
      res.sendfile(path, {"root": "./"});
   }
  );

router.route('/exemplares')   // operacoes sobre todos os exemplares
  .get(function(req, res) {  // GET
    var response = {};
    mongoOp.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"exemplares": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"id": req.body.id};
     var response = {};
     mongoOp.findOne(query, function(erro, data) {
        if (data == null) {
           var db = new mongoOp();
           db.id = req.body.id;
           db.title = req.body.title;
           db.author = req.body.author;
	   db.area = req.body.area;
           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de insercao no BD"};
                 res.json(response);
             } else {
                 response = {"resultado": "Exemplar inserido no BD"};
                 res.json(response);
              }
            }
          )
        } else {
	    response = {"resultado": "Exemplar ja existente"};
            res.json(response);
          }
        }
      )
    }
  );


router.route('/exemplares/:id')   // operacoes sobre um aluno (RA)
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"id": req.params.id};
      mongoOp.findOne(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
         } else if (data == null) {
             response = {"resultado": "exemplar inexistente"};
             res.json(response);   
	 } else {
	    response = {"exemplares": [data]};
            res.json(response);
           }
        }
      )
    }
  )
  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"id": req.params.id};
      var data = {"title": req.body.title, "author": req.body.author};
      mongoOp.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	  } else if (data == null) { 
             response = {"resultado": "exemplar inexistente"};
             res.json(response);   
          } else {
             response = {"resultado": "exemplar atualizado no BD"};
             res.json(response);   
	  }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
     var response = {};
     var query = {"id": req.params.ra};
      mongoOp.findOneAndRemove(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
	 } else if (data == null) {	      
             response = {"resultado": "exemplar inexistente"};
             res.json(response);
            } else {
              response = {"resultado": "exemplar removido do BD"};
              res.json(response);
	   }
         }
       )
     }
  );