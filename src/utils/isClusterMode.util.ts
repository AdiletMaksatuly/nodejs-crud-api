import cluster from 'cluster';

export const isClusterMode = (): boolean => {
	return cluster.isWorker;
};
