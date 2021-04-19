module.exports = {
  hmr: {
    port: process.env.CODESANDBOX_SSE ? '443' : '',
  },
  optimizeDeps: {
    exclude: [
      '@roxi/routify',
      'fastify-static',
      'fastify',
      'fastify-jwt',
      'dotenv',
      'jsonwebtoken',
      'fastify-env',
      'fastify-plugin',
      'rethinkdb',
      'fastify-autoload',
      'fastify-sensible',
      'under-pressure',
      'async-mqtt',
      'svelte-simple-datatables',
      'argon2',
      'fastify-couchdb',
    ],
  },
  proxy: {
    '/api/v1': 'http://127.0.0.1:3001/',
  },
}
