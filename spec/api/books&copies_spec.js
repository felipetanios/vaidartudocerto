var frisby = require('frisby');


// TESTE DE LIVROS
frisby.create('testa o metodo post dos livros')
  .post('http://localhost:3000/books', {
    title: "Otelo",
    author: "Shakespeare",
    area: "Literatura"
  })
  .expectStatus(200)
.toss();

frisby.create('testa o metodo get com titulo do livro')
  .get('http://localhost:3000/books/Otelo')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      books : [{
              bookID: Number,
              author: String,
              title: String,
              area: String,
              nCopies: Number
      }]
  })
.toss();

frisby.create('testa o metodo get com titulo de livro errado')
  .get('http://localhost:3000/books/A')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
      resultado: "Livro inexistente."
  })
.toss();

// TESTE DE EXEMPLARES
frisby.create('testa o metodo post dos exemplares')
  .post('http://localhost:3000/copies', {
    title: "Otelo",
    owner: "Fabio"
  })
  .expectStatus(200)
.toss();

frisby.create('testa o metodo get de todos os exemplares pertencentes a Fabio')
  .get('http://localhost:3000/copies/Fabio')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      copies : [{
              bookID: Number,
              copyID: Number,
              owner: String
      }]
  })
.toss();

frisby.create('testa o metodo post com exemplar de livro não existente')
  .post('http://localhost:3000/copies', {
    title: "Moreninha",
    owner: "Fabio"
  })
  .expectJSONTypes({
    resultado: "Livro inexistente."
  })
  .expectStatus(200)
.toss();


frisby.create('deleta todos os exemplares de livro de Fabio')
  .delete('http://localhost:3000/copies/Fabio', {})
  .expectJSONTypes({
    resultado: "Exemplares do proprietário removidos."
  })
  .expectStatus(200)
.toss();