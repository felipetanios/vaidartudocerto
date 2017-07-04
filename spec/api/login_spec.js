var frisby = require('frisby');
frisby.create('Testa o fluxo principal do caso de uso de login de usuario')
    .post('http://localhost:3000/usersignup', {
        user: "hurleyb",
        password: "barreiro"
    })
    .after(function(err, res, body){
      frisby.create('Com usuario cadastrado podemos logar')
          .post('http://localhost:3000/authentication', {
              user: "hurleyb",
              password: "barreiro"
          })
          .expectStatus(200)
          .expectHeaderContains('Content-Type', 'application/json')
          .expectJSON({
              resultado: "Usuario logado com sucesso"
          })
    })
    .toss();

frisby.create('Testa o fluxo principal do caso de uso de logout de usuario')
.post('http://localhost:3000/usersignup', {
    user: "hurleyb",
    password: "barreiro"
})
.after(function(err, res, body){
  frisby.create('Com usuario cadastrado podemos logar')
    .post('http://localhost:3000/authentication', {
        user: "hurleyb",
        password: "barreiro"
    })
  .after(function(err, res, body){
    frisby.create('agora podemos fazer log off')
    .delete('http://localhost:3000/authentication')
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'application/json')
    .expectJSON({
        resultado: "Sucesso"
    })
  })
})
  .toss();

frisby.create('Testa o fluxo alternativo do caso de uso de logout de usuario, para sem ter login')
  .delete('http://localhost:3000/authentication')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
      resultado: "Clique em LOGIN para continuar"
  })
  .toss();

frisby.create('Testa o fluxo alternativo do caso de uso de login de usuario para usuario inexistente')
    .post('http://localhost:3000/authentication', {
        user: "stan",
        password: "wawrinka"
    })
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'application/json')
    .expectJSON({
        resultado: "Usuario nao existente"
    })
    .toss();

frisby.create('Testa o fluxo alternativo do caso de uso de login de usuario para senha incorreta')
    .post('http://localhost:3000/authentication', {
        user: "hurleyb",
        password: "wawrinka"
    })
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'application/json')
    .expectJSON({
        resultado: "Usuario ou senha inválidos"
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
