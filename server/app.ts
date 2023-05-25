import { createServer } from 'http';
import Gun from 'gun';

const server = createServer().listen(8080);
const gun = Gun({ web: server });
