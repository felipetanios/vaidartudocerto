var frisby = require('frisby');
frisby.create('testa o metodo get dos livros')
  .get('http://localhost:3000/books')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      books : Array
   })
.toss();

frisby.create('testa o metodo get com titulo do livro')
  .get('http://localhost:3000/books/Dom Casmurro')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      books : [{
              owner: String,
              author: String,
              title: String,
              area: String
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
