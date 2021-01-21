import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const assets = {
	targets: [{ src: ['static/index.html', 'static/style.css'], dest: 'dist' }],
};

function watchstatic(options = {}) {
	const { targets = [] } = options;

	return {
		name: 'watchstatic',
		buildStart() {
			for (const target of targets) {
				if (Array.isArray(target.src)) {
					for (const file of target.src) {
						this.addWatchFile(file);
					}
				} else this.addWatchFile(target.src);
			}
		},
	};
}

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/bundle.js',
		sourcemap: true,
		format: 'iife',
	},
	plugins: [
		serve({
			contentBase: 'dist/',
			host: 'localhost',
			port: 8080,
		}),
		livereload({
			exts: ['html', 'js', 'less', 'css'],
			watch: './dist/',
			port: 500,
			delay: 200,
		}),
		typescript({ lib: ['es5', 'es6', 'dom'], target: 'es6', sourceMap: true }),
		resolve(),
		commonjs(),
		copy(assets),
		watchstatic(assets),
	],
};
