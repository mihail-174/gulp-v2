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
  jade: `.{blockName} Содержимое блока`,
  scss: `@import '../helpers/_helpers';\n\n.{blockName} {}`
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
        resolve();
      } else {
        reject(`ERR>>> Блок '${blockName}' уже существует.`);
      }
    });
  });
}

function createDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, err => {
      if (err) {
        reject(`ERR>>> Не удалось создать папку '${dirPath}'`);
      } else {
        resolve();
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
            reject(`ERR>>> Не удалось создать файл '${filePath}'`);
          } else {
            resolve();
          }
        });
      })
    );
  });

  return Promise.all(promises);
}

function getFiles(blockPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(blockPath, (err, files) => {
      if (err) {
        reject(`ERR>>> Не удалось получить список файлов из папки '${blockPath}'`);
      } else {
        resolve(files);
      }
    });
  });
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
      .then(() => createDir(blockPath))
      .then(() => createFiles(blockPath, blockName))
      .then(() => getFiles(blockPath))
      .then(files => {
        const line = '-'.repeat(48 + blockName.length);
        console.log(line);
        console.log(`Блок был создан в 'src/components/${blockName}'`);
        console.log(line);

        // Displays a list of files created
        files.forEach(file => console.log(file));

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
  rl.setPrompt('Block(s) name: ');
  rl.prompt();
  rl.on('line', (line) => {
    initMakeBlock(line).catch(printErrorMessage);
  });
}
