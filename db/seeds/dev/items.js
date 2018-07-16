exports.seed = function (knex, Promise) {
  return knex('items')
    .del()
    .then(() => {
      return Promise.all([
        knex('items')
          .insert([
            { name: 'Water' },
            { name: 'Potato' },
            { name: 'Dirt' }
          ])
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
