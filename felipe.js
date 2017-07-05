
var mongoUsers = require('./models/mongoUsers');


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
      // var pass = req.body.password;
      var query = {"user": user}
      var response = {};

      mongoUsers.findOne(query, function(erro, data) {
        console.log(data);

         if (data == null) {
            var db = new mongoUsers();
            db.user =  req.body.user;
            var pwd = req.body.password;
            pwd = pwd % 7907;
            db.password = pwd

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
      var query2 = {"owner": user}

      mongoUsers.findOneAndRemove(query, function(erro, data) {
          if(erro) {
             response = {"resultado": "falha de acesso ao DB"};
             res.json(response);
          }else if (data == null) {
              response = {"resultado": "Usuario inexistente"};
              res.json(response);
             } else {
               mongoCopies.remove(query2, function(erro, data){});
               res.clearCookie('EA975');	 //desloga o usuario
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
    pass = pass % 7907;
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
     res.clearCookie('EA975');	 // remove cookie no cliente
     res.json({'resultado': 'Sucesso'});
     }
  );
