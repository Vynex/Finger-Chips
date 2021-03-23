import app from './app.js';
import { createServer } from 'http';
import { PORT } from './configs/config.js';
import { info } from './utils/logger.js';

const server = createServer(app);


server.listen(PORT, () => {
	info(`Server Listening at Port ${PORT}`);
});
