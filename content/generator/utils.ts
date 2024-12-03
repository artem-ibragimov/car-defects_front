export function chain<T = void>(fs: ((arg: T) => Promise<T>)[], init?: T) {
	return fs.reduce<Promise<T>>((ch, f) => ch.then(f), Promise.resolve(init) as Promise<T>);
}
