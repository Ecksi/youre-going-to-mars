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

// endpoints
// api/v1/items => GET POST
// api/v1/items/:id => PUT DELETE

app.get('/api/v1/items', (request, response) => {
  database('items')
    .select()
    .then(exchanges => response.status(200).json(exchanges))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/items', (request, response) => {
  const { name } = request.body;
// add 422 for missing fields
  database('items').insert({ name: name }, 'id')
    .then(item => {
      response.status(201).json({ id: item[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


module.exports = app;