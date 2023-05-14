import { Server } from './lib/index.js';
import { appRouter } from './app/index.js';
import { usersRouter } from './users/index.js';
import { json, parseBody } from './lib/middlewares/index.js';
import { BASE_URL } from './constants/base-url.const.js';
import { Database } from './lib/Database/index.js';
import cluster, { type Worker as ClusterWorker } from 'cluster';
import {
	isGetOperationMessage,
	isSetOperationMessage,
} from './lib/utils/index.js';
import {
	type MessageFromMaster,
	type MessageFromMasterSuccess,
} from './lib/Database/message.interface.js';
import http from 'http';
import { PORT } from './constants/port.const.js';
import { CPU_COUNT } from './constants/cpus.const.js';
import { createWorkerPort } from './utils/createWorkerPort.util.js';

export const DB = new Database();

export const createAppServer = (): Server => {
	const server = new Server();

	const registerRouter = server.registerRouter.bind(server, BASE_URL);

	registerRouter(appRouter);
	registerRouter(usersRouter);

	server.use(json);
	server.use(parseBody);

	return server;
};

const handleMessageFromWorker = (
	forkedWorker: ClusterWorker,
	workerWhoEmitted: ClusterWorker,
	message: unknown
): void => {
	if (workerWhoEmitted.id !== forkedWorker.id) return;

	if (isGetOperationMessage(message)) {
		const value: unknown = DB.get(message.key);

		workerWhoEmitted.send({
			message: value,
		});
	}

	if (isSetOperationMessage(message)) {
		DB.set(message.key, message.value);

		const messageToWorker: MessageFromMaster<MessageFromMasterSuccess> = {
			message: {
				message: 'OK',
			},
		};

		workerWhoEmitted.send(messageToWorker);
	}
};

export const spreadWorkers = (): void => {
	for (let i = 0; i < CPU_COUNT; i++) {
		const forkedWorker = cluster.fork({
			PORT: createWorkerPort(i),
		});

		cluster.on('message', (workerWhoEmitted, message: unknown) => {
			handleMessageFromWorker(forkedWorker, workerWhoEmitted, message);
		});
	}
};

export const createLoadBalancerServer = (): void => {
	let currentWorkerIndex = 0;

	const loadBalancerServer = http.createServer((req, res) => {
		if (!cluster.workers) return;
		if (currentWorkerIndex >= Object.keys(cluster.workers).length) {
			currentWorkerIndex = 0;
		}

		const worker =
			cluster.workers[Object.keys(cluster.workers)[currentWorkerIndex]];

		if (!worker) return;

		console.info(`Worker ${String(worker.process.pid)} is handling request`);

		const proxyRequest = http.request(
			{
				hostname: 'localhost',
				port: createWorkerPort(currentWorkerIndex),
				path: req.url,
				method: req.method,
				headers: req.headers,
			},
			(proxyResponse) => {
				res.writeHead(proxyResponse.statusCode ?? 200, proxyResponse.headers);
				proxyResponse.pipe(res);
			}
		);

		req.pipe(proxyRequest);

		currentWorkerIndex++;
	});

	loadBalancerServer.listen(PORT, () => {
		console.info(
			`Master process ${process.pid} server started on port: ${PORT}`
		);
	});
};

export const createWorkerServer = (): void => {
	const server = createAppServer();

	server.listen(PORT, () => {
		console.info(
			`Worker process ${process.pid} server started on port: ${PORT}`
		);
	});
};
