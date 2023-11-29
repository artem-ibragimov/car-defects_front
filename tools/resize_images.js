import chalk from 'chalk';
import { existsSync, readdirSync } from 'fs';
import sizeOf from 'image-size';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin-keep-folder';
import imageminWebp from 'imagemin-webp';

const error = (e) => console.error(chalk.red(e));
const FOLDER = './static/assets/img';
try {
	resize_images(FOLDER, [320, 480, 640, 720]);
	imagemin([`${FOLDER}/**/*.{png,webp}`], {
		use: [imageminWebp({ method: 6, quality: 100, lossless: 9 })]
	}).then(console.log);
} catch (e) {
	error(e);
}

/**
 *
 * @param {string} dir
 * @param {number[]} widths
 */
function resize_images(dir, widths) {
	const paths = collectPaths(dir);
	const size_prefix = '--';
	paths.forEach((p) => {
		sizeOf(p, (err, dimensions) => {
			if (err) {
				return error(err);
			}
			if (!dimensions || !dimensions.width || !dimensions.height) {
				return;
			}
			const aspect_ratio = dimensions.width / dimensions.height;
			const [fullpath, extension] = p.split('.');
			const [img_path, size] = fullpath.split(size_prefix);
			const shrp = sharp(p);
			widths
				.filter((w) => !existsSync(`${img_path}${size_prefix}${w}.${extension}`))
				.forEach((w) => {
					shrp
						.resize(w, parseInt((w / aspect_ratio).toFixed(), 10))
						.toFile(`${img_path}${size_prefix}${w}.${extension}`);
				});
		});
	});
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
