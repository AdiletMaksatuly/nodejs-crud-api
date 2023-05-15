import { PORT } from '../constants/port.const.js';

export const createWorkerPort = (workerIndex: number): number => {
	return +PORT + workerIndex + 1;
};
