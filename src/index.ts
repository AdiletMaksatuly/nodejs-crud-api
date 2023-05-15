import 'dotenv/config.js';
import cluster from 'cluster';
import { parseArgs } from './utils/args.util.js';
import { PORT } from './constants/port.const.js';
import { type ProcessArgs } from './types/process-args.type.js';
import {
	createAppServer,
	createLoadBalancerServer,
	createWorkerServer,
	spreadWorkers,
} from './server.js';

const processArgs = parseArgs(process.argv);

const start = (args: ProcessArgs): void => {
	if (args.mode === 'cluster') {
		if (cluster.isPrimary) {
			spreadWorkers();
			createLoadBalancerServer();
		}

		if (cluster.isWorker) {
			createWorkerServer();
		}
	} else {
		const server = createAppServer();

		server.listen(PORT, () => {
			console.info(`Server started on port: ${PORT}`);
		});
	}
};

start(processArgs);
