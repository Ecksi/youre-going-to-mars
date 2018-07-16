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

app.get('/api/v1/items', (req, res) => {
  database('items')
    .select()
    .then(exchanges => res.status(200).json(exchanges))
    .catch(error => res.status(500).json({ error }));
});


module.exports = app;