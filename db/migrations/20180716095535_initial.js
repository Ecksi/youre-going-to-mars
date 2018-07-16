exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', table => {
      table.increments('id').primary();
      table.string('name');
      table.boolean('packed').notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items')
  ]);
};
