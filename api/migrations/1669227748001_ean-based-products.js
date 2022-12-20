/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addConstraint('users', 'users_pk', { primaryKey: 'id' })
  pgm.createType('rating_enum', ['0', '1', '2', '3', '4', '5'])
  pgm.createTable('products', {
    ean: { type: 'text', unique: true, notNull: true, primaryKey: true }
  })
  pgm.createTable('products_review', {
    body: { type: 'text', notNull: true },
    user_id: { type: 'integer', notNull: true, references: 'users' },
    product_id: { type: 'text', notNull: true, references: 'products' },
    rating: { type: 'rating_enum', notNull: true, default: '3' }
  })
  pgm.createTable('user_products', {
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade'
    },
    product_id: {
      type: 'text',
      notNull: true,
      references: 'products'
    }
  })
  // user_products pkey
  pgm.addConstraint('user_products', 'user_products_pkey', {
    primaryKey: ['user_id', 'product_id']
  })
  // Idx by product_id (most used select -> where product_id = :id)
  pgm.createIndex('products_review', 'product_id')
  // Unique idx on per user per review
  pgm.createIndex('products_review', ['user_id', 'product_id'], {
    unique: true
  })
}
