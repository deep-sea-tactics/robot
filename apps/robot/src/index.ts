import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './server.js';

const server = createHTTPServer({
  router
});

console.log('Listening on http://localhost:9000');
server.listen(9000);
