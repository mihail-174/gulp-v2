'use strict';

import fs from 'fs';
import path from 'path';
import {
	createInterface
} from 'readline';
const rl = createInterface(process.stdin, process.stdout);

// folder with all blocks
const BLOCKS_DIR = path.join(__dirname, 'src/components');

// //////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const fileSources = {
	js: `(function($) {
		if (typeof Drupal !== 'undefined') {
			Drupal.behaviors.{blockName} = {
				attach: function(context, settings) {
					init();
				}
			};
		} else {
			init();
		}

		function init() {
			// Ваш код
		}

	})(jQuery);
	`
};

function validateBlockName(blockName) {
	return new Promise((resolve, reject) => {
		const isValid = /^(\d|\w|-)+$/.test(blockName);

		if (isValid) {
			resolve(isValid);
		} else {
			const errMsg = (
				`ERR>>> Неправильное имя блока '${blockName}'\n` +
				`ERR>>> Имя блока должно включать в себя буквы, цифры и символ "минус".`
			);
			reject(errMsg);
		}
	});
}

function directoryExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath, notExist => {
			if (notExist) {
				const line = '-'.repeat(48 + blockName.length);
				reject(`${line}\nКомпонента '${blockName}' не существует.\n${line}`);
			} else {
				resolve();
			}
		});
	});
}

function filesExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath + '/' + blockName + ".js", function(err, stats) {
			if (err) {
				resolve();
			} else {
				const line = '-'.repeat(48 + blockName.length);
				reject(`${line}\nФайл '${blockName}.js' уже существует в папке.\n${line}`);
			}
		});
	});
}

function createFiles(blocksPath, blockName) {
	const promises = [];
	Object.keys(fileSources).forEach(ext => {
		const fileSource = fileSources[ext].replace(/\{blockName}/g, blockName);
		const filename = `${blockName}.${ext}`;
		const filePath = path.join(blocksPath, filename);

		promises.push(
			new Promise((resolve, reject) => {
				fs.writeFile(filePath, fileSource, 'utf8', err => {
					if (err) {
						const line = '-'.repeat(48 + blockName.length);
						reject(`${line}\nНе удалось создать '${filename}' в '${blocksPath}'\n${line}`);
					} else {
						resolve();
					}
				});
			})
		);
	});

	return Promise.all(promises);
}


function printErrorMessage(errText) {
	console.log(errText);
	rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(candidateBlockName) {
	const blockNames = candidateBlockName.trim().split(/\s+/);

	const makeBlock = blockName => {
		const blockPath = path.join(BLOCKS_DIR, blockName);

		return validateBlockName(blockName)
		.then(() => directoryExist(blockPath, blockName))
		.then(() => filesExist(blockPath, blockName))
		.then(() => createFiles(blockPath, blockName))
		.then(files => {
			const line = '-'.repeat(48 + blockName.length);
			console.log(line);
			console.log(`Файл ${blockName}.js был создан в 'src/components/${blockName}'`);
			console.log(line);
			rl.close();
		});
	};

	if (blockNames.length === 1) {
		return makeBlock(blockNames[0]);
	}

	const promises = blockNames.map(name => makeBlock(name));
	return Promise.all(promises);
}


// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
const blockNameFromCli = process.argv
.slice(2)
// join all arguments to one string (to simplify the capture user input errors)
.join(' ');

// If the user pass the name of the block in the command-line options
// that create a block. Otherwise - activates interactive mode
if (blockNameFromCli !== '') {
	initMakeBlock(blockNameFromCli).catch(printErrorMessage);
} else {
	rl.setPrompt('Введите имя файла: ');
	rl.prompt();
	rl.on('line', (line) => {
		initMakeBlock(line).catch(printErrorMessage);
	});
}
