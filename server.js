const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = "You're going to Mars!!";
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(exchanges => response.status(200).json(exchanges))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').select().where('id', id)
    .then(items => response.status(200).json(items)[id])
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/items', (request, response) => {
  const { name } = request.body;
  
  database('items').insert({ name: name }, 'id')
    .then(item => response.status(201).json({ id: item[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.put('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const { packed } = request.body;

  database('items').select().where({ id })
    .update('packed', packed)
    .then(packed => response.status(201).json(packed))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').where('id', id).del()
    .then(() => response.status(202).json({'id': id}));
});

module.exports = app;