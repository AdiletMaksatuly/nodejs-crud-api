export const keys = <Obj extends Record<string, unknown>>(
	obj: Obj
): Array<keyof Obj> => {
	return Object.keys(obj) as Array<keyof Obj>;
};
