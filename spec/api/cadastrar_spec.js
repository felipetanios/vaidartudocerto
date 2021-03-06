var frisby = require('frisby');
frisby.create('Testa o fluxo principal do caso de uso de cadastrar usuario')
    .post('http://localhost:3000/authentication', {
      user: "hurleyb",
      password: "barreiro"
    })
    .after(function(err, res, body){
      frisby.create('Apos logar, podemos remover o usuario')
      .delete('http://localhost:3000/usersignup', {
          user: "hurleyb",
          password: "barreiro"
      })    
      .after(function(err, res, body){
        frisby.create('Agora cadastramos o usuario')
        .post('http://localhost:3000/usersignup', {
            user: "hurleyb",
            password: "barreiro"
        })
        .expectStatus(200)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectJSON({
            resultado: "Usuario cadastrado"
        })
      })
    })
    .toss();

frisby.create('Testa fluxo alternativo do caso de uso de cadastrar usuario para usuario ja cadastrado')
    .post('http://localhost:3000/usersignup', {
        user: "hurleyb",
        password: "barreiro"
    })
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'application/json')
    .expectJSON({
        resultado: "Usuario ja existente"
    })
    .toss();

frisby.create('Testa o fluxo principal do caso de uso de remover usuario')
    .post('http://localhost:3000/authentication', {
      user: "hurleyb",
      password: "barreiro"
    })
    .after(function(err, res, body){
      frisby.create('Apos logar, podemos remover o usuario')
      .delete('http://localhost:3000/usersignup', {
          user: "hurleyb",
          password: "barreiro"
      })
      .expectStatus(200)
      .expectHeaderContains('Content-Type', 'application/json')
      .expectJSON({
          resultado: "Usuario removido"
      })
    })
    .toss();
