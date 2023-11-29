import Client from 'ftp';
import fs from 'fs';
import path from 'path';

const c = new Client();
c.on('ready', function () {
	collectPaths('./build').forEach((p) => {
		const filename = path.relative('./build', p);
		c.size(filename, (e, size) => {
			if (!e && fs.statSync(p).size == size) {
				console.log('Skip', p);
				return;
			}
			if (filename.includes(path.sep)) {
				const folder = filename.slice(0, filename.lastIndexOf(path.sep));
				c.mkdir(folder, true, (e) => {
					if (e) throw e;
				});
			}
			c.put(p, filename, (e) => {
				if (e) throw e;
				console.info(filename);
			});
		});
	});
	c.end();
});
c.on('error', console.error);
c.on('end', () => {
	console.log('ended');
});
c.connect({
	host: 'h35.netangels.ru',
	port: 21,
	user: 'c61865_front',
	password: 'kO3sx90rA'
});

/**
 * @param {string} root
 * @returns {string[]}
 */
function collectPaths(root) {
	const paths = fs.readdirSync(root).map((entity_name) => path.join(root, entity_name));
	const dir_paths = paths.filter((p) => !p.includes('.'));
	return paths.filter((p) => p.includes('.')).concat(...dir_paths.map(collectPaths));
}
