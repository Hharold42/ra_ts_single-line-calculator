export const compose = <T>(...fns: Array<(a: T) => T>) => (arg: T) => fns.reduce((prev, curr) => curr(prev), arg)