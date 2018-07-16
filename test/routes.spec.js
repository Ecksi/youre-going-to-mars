const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const config = require('../knexfile')[process.env.NODE_ENV = 'test'];
const knex = require('knex')(config);

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  it('should receive a response of html when we hit the root end point', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/goodbyeEarth')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API routes', () => {

  beforeEach(done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => done());
          });
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return an array of all items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.should.be.a('object');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Water');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
          done();
        });
    });

    it('should return a status of 404 if the wrong route is given', done => {
      chai.request(server)
        .get('/api/v1/itemzzz')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return an array of one item', done => {
      chai.request(server)
        .get('/api/v1/items/3')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Dirt');
          done();
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should post a new item to the database', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({ name: 'Chicken' })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
          done();
        });
    });

    it('should return an empty array if the id for the item was not found', done => {
      chai.request(server)
        .get('/api/v1/items/193934')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(0);
          done();
        });
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('should update the status of packed', done => {
      chai.request(server)
        .put('/api/v1/items/2')
        .send({ packed: true })
        .end((error, response) => {
          response.should.have.status(201);

          chai.request(server)
            .get('/api/v1/items')
            .end((error, response) => {
              response.body[2].packed.should.equal(true);
              done();
            });
        });
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete an item from the database', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.body.length.should.equal(3);

          chai.request(server)
            .delete('/api/v1/items/3')
            .end((error, response) => {
              response.should.have.status(202);
              response.type.should.equal('application/json');
              response.body.should.have.property('id');
              response.body.id.should.equal('3');

              chai.request(server)
                .get('/api/v1/items')
                .end((error, response) => {
                  response.body.length.should.equal(2);
                  done();
                });
            });
        });
    });
  });
});