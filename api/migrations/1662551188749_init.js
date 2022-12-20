/* eslint-disable camelcase */
/* eslint-disable */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createType('user_roles', ['normal', 'admin'])
  pgm.createTable('users', {
    id: { type: 'serial' },
    username: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(60)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    last_login: { type: 'timestamp', notNull: false },
    role: { type: 'user_roles', default: 'normal', notNull: true }
  })
}
