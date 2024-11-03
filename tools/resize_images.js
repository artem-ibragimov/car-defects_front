import chalk from 'chalk';
import { existsSync, readdirSync, rename, renameSync, unlinkSync } from 'fs';
import { unlink } from 'node:fs/promises';
import sizeOf from 'image-size';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin-keep-folder';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';

import child_process from 'child_process';

const error = (e) => console.error(chalk.red(e));
const FOLDER = './static/assets/img';
const SIZES = [320, 640];
const SIZE_PREFIX = '--';

remove_resized(FOLDER)
	.then(() =>
		imagemin([`${FOLDER}/**/*.png`], {
			use: [imageminWebp({ method: 6, quality: 100, lossless: 9 })]
			// use: [imageminPngquant()]
		})
	)
	.then(() => resize_images(FOLDER, SIZES))
	.catch(error);

function remove_resized(dir) {
	const paths = collectPaths(dir);
	return Promise.all(paths.map((p) => unlink(p).catch(error)));
}
function resize_images(dir, widths) {
	const paths = collectPaths(dir);
	const resizing = paths.map((p) => {
		let dimensions = { width: 0, height: 0 };
		try {
			dimensions = sizeOf(p);
		} catch (e) {
			unlinkSync(p);
			throw e;
		}
		if (!dimensions || !dimensions.width || !dimensions.height) {
			return Promise.resolve();
		}
		const aspect_ratio = dimensions.width / dimensions.height;

		const lowerCasePath = p.toLowerCase();
		if (lowerCasePath !== p) {
			renameSync(p, lowerCasePath);
			child_process.exec(`git mv "${p}" "${lowerCasePath}"`, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.error(`stderr: ${stderr}`);
			});
		}
		const [fullpath, extension] = lowerCasePath.split('.');
		const [img_path] = fullpath.split(SIZE_PREFIX);
		const shrp = sharp(lowerCasePath);

		return Promise.all(
			widths
				.filter((w) => !existsSync(`${img_path}${SIZE_PREFIX}${w}.${extension}`))
				.map((w) =>
					shrp
						.resize(w, parseInt((w / aspect_ratio).toFixed(), 10))
						.toFile(`${img_path}${SIZE_PREFIX}${w}.${extension}`)
						.catch(error)
				)
		);
	});
	return Promise.all(resizing);
}

/**
 * @param {string} root
 * @returns {string[]}
 */
function collectPaths(root) {
	const paths = readdirSync(root).map((entity_name) => path.join(root, entity_name));
	const dir_paths = paths.filter((p) => !p.includes('.'));
	return paths.filter((p) => p.endsWith('.webp')).concat(...dir_paths.map(collectPaths));
}
