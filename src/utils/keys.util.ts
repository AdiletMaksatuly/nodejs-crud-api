export const keys = (obj: Record<string, unknown>): (keyof typeof obj)[] => {
    return Object.keys(obj) as (keyof typeof obj)[];
}
