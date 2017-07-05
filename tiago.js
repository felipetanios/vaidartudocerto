// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoBooks = require('./models/mongoBooks');
var mongoCopies = require('./models/mongoCopies');
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
app.use(bodyParser.urlencoded({"extended" : true }));
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

//funcao para checar se esta deslogado(para a funcao se estiver deslogado)
function checkAuth(req, res) {
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  if(key == undefined || key == ''){
    res.json({'resultado': 'Clique em LOGIN para continuar'});
    return false;
  }else{
    return true;
  }
}

function checknotAuth(req, res) {
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  if(key == undefined || key == ''){
    return true;
  }else{
    res.json({'resultado': 'Operação invalida. Usuário ja logado.'});
    return false;
  }
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

router.route('/books')   // operacoes sobre todos os livros
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
     
     if(! checkAuth(req, res)) return;

     mongoBooks.findOne(query, function(erro, data) {
      
        if (data == null) {
           var db = new mongoBooks();
           //db.owner = req.body.owner;
           db.title = req.body.title;
           db.author = req.body.author;
           db.bookID = Math.floor(Math.random() * 5000000000) + 1; 
           db.area = req.body.area; 
           db.nCopies = 0;    

           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de inserção no BD."};
                 res.json(response);
             } else {
                 response = {"resultado": "Livro inserido corretamente."};
                 res.json(response);
              }
            }
          );

        } else {
            response = {"resultado": "Livro já existente."};
            res.json(response);
          }
        }
      )
    }
  );

router.route('/books/bookID')
  .post(function(req, res) {   // GET
      var response = {};
      var query = {"bookID": req.body.bookID};

      console.log(req.path);
      console.log(JSON.stringify(req.body));
      console.log(query);

      mongoBooks.find(query, function(erro, data) {
       
         if(erro) {
            response = {"resultado": "Falha de acesso ao BD."};
            res.json(response);
         } else if (data == null) {
            response = {"resultado": "Livro inexistente."};
            res.json(response);   
         } else {
            response = {"books": data};
            console.log(response);
            res.json(response);

          }
        }
      )      
    }
  );

router.route('/books/title/:title')   // operacoes sobre um livro
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
      var data = {"title": req.params.title, //"nCopies": req.params.nCopies, //"owner": req.body.owner, 
                  "author": req.body.author, "area": req.body.area};

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


/*
*   OPERAÇÕES SOBRE EXEMPLARES
*/
router.route('/copies')   // operacoes sobre os exemplares de um determinado dono
  .get(function(req, res) {  // GET
    var response = {"resultado":"Forneça o usuário para acessar seus exemplares."};
    res.json(response);
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"title": req.body.title};
     var response = {};

     console.log(req.path);
     console.log(JSON.stringify(req.body));
     console.log(query);

     if(! checkAuth(req, res)) return;

     mongoBooks.findOne(query, function(erro, data) {
      
        if (data != null) {
           var db = new mongoCopies();
           db.owner = req.body.owner;
           db.bookID = data.bookID;
           // gera id do exemplar 
           db.copyID = Math.floor(Math.random() * 10000000000) + 1;     

           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de inserção no BD."};
                 res.json(response);
             } else {
                 response = {"resultado": "Exemplar inserido corretamente."};
                 res.json(response);
              }
            }
          )

          // atualiza número de exemplares do livro disponiveis
          var nCopies = data.nCopies + 1;
          var data = {"nCopies": nCopies}

          mongoBooks.findOneAndUpdate(query, data, function(erro, data) {
              
              if(erro) {
                response = {"resultado": "Falha de acesso ao BD!"};
                res.json(response);
              }
            }
          );


        } else {
            response = {"resultado": "Livro não existente. Para cadastrar um exemplar, cadastre o livro primeiro."};
            res.json(response);
          }
        }
      )
    }
  );
  /*.put(function(req, res) {   // PUT (altera exemplar)
      var response = {};
      var query = {"copyID": req.params.copyID};
      var data = {"owner": req.params.owner, "bookID": req.body.bookID, "copyID": req.body.copyID};

      console.log(req.path);
      console.log(JSON.stringify(req.body));
      console.log(query);

      /*mongoBooks.findOneAndUpdate(query, data, function(erro, data) {
          
          if(erro) {
            response = {"resultado": "Falha de acesso ao BD!"};
            res.json(response);
          } else if (data == null) { 
             response = {"resultado": "Exemplar inexistente."};
             res.json(response);   
          } else {
             response = {"resultado": "Exemplar atualizado."};
             res.json(response);   
    }
        }
      )
    }
  )*/


router.route('/copies/:owner')   // operacoes sobre um exemplar
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"owner": req.params.owner};

      console.log(req.path);
      console.log(JSON.stringify(req.body));
      console.log(query);

      mongoCopies.find(query, function(erro, data) {
       
         if(erro) {
            response = {"resultado": "Falha de acesso ao BD."};
            res.json(response);
         } else if (data == null) {
            response = {"resultado": "Exemplar inexistente."};
            res.json(response);   
         } else {
            response = {"copies": [data]};
            console.log(response);
            res.json(response);

          }
        }
      )
    
      
    }
  );

router.route('/copies/:owner/:bookID')
  .delete(function(req, res) {   // DELETE (remove)
     var response = {};
     var query = {"owner": req.params.owner,"bookID": req.params.bookID};

     if(! checkAuth(req, res)) return;
     console.log(req.path);
     console.log(req.params);
     console.log(query);

     mongoCopies.findOneAndRemove(query, function(erro, data) {
       
         if(erro) {
            response = {"resultado": "Falha de acesso ao BD!"};
            res.json(response);
         }else if (data == null) {        
             response = {"resultado": "Exemplar inexistente."};
             res.json(response);
            } else {
              response = {"resultado": "Exemplar removido do seu inventório."};
              res.json(response);
             }

         query = {"bookID": req.params.bookID};

         mongoBooks.findOne(query, function(erro, data) {
          
            if (data != null) {
              // atualiza número de exemplares do livro disponiveis
              var nCopies = data.nCopies - 1;
              var data = {"nCopies": nCopies}

              mongoBooks.findOneAndUpdate(query, data, function(erro, data) {
                  
                  if(erro) {
                    response = {"resultado": "Falha de acesso ao BD!"};
                    res.json(response);
                  }
                }
              );


            } else {
                response = {"resultado": "Livro não existente. Para remover um exemplar, o livro deve ser cadastrado!"};
                res.json(response);
              }
            }
          )
        }
      )
    }

  );
 
router.route('/copies/title/:title')
    .get(function(req, res){
        var response = [];
        
        console.log(req.params.title);
        
        var query = {
            title : req.params.title
        };
        
        mongoBooks.findOne(query, function(err, data){
            if(err){
                res.json({
                    resultado : "Falha de acesso ao BD!"
                });
                return;
            }
            
            if(data){
                
                var query = {
                    bookID : data.bookID
                };
                
                var book = data;
                
                mongoCopies.find(query, function(err, data){
                    if(err){
                        res.json({
                            resultado : "Falha de acesso ao BD!"
                        });
                        return;
                    }
                    
                    if(data){
                        for(var i=0; i<data.length; i++){
                            response[i] = {
                                title  : book.title,
                                author : book.author,
                                area   : book.area,
                                owner  : data.owner
                            }
                        }
                        res.json({
                            copies : response,
                        });
                        console.log(response);
                    }
                    else{
                        res.json({
                            resultado : "Não foi encontrado exemplar para esse título =("
                        });
                    }
                });
            }
        });
    });
                        
                        
 
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
      if(!checknotAuth(req, res)) return;
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
               res.clearCookie('EA975');   //desloga o usuario
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
    if(!checknotAuth(req, res)) return;
    console.log(query);

    // verifica usuario e senha na base de dados
    mongoUsers.findOne(query, function(erro, data) {
      console.log(data);

      if (data == null) {
        console.log("entrou aqui");
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
     res.clearCookie('EA975');   // remove cookie no cliente
     res.json({'resultado': 'Sucesso'});
     }
  );