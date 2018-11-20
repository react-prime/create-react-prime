#!/usr/bin/env node

var program = require('commander');
var cmd = require('node-cmd');
var fs = require('fs');
var pkg = require('./package.json');

program
  .version(pkg.version)
  .parse(process.argv);

var repoName = 'react-prime';
var projectName = program.args[0] || repoName;

if (fs.existsSync(projectName)) {
  return console.error(`Error: directory '${projectName}' already exists.`);
}

var commands = [
  `git clone https://github.com/JBostelaar/${repoName}.git ${projectName}`,
  `cd ${projectName}`,
  'rm -rf .git',
  'rm .travis.yml',
  'npm i',
].join(' && ');

cmd.run(commands);

console.log(`Cloning ${repoName}...`);

// Wait for project folder to exist
while(!fs.existsSync(`./${projectName}`)) {}

// Wait for node_modules folder to exist to check if we are in the "npm i" phase
while(!fs.existsSync(`./${projectName}/node_modules`)) {}

console.log('Installing packages...');

var projectPkgPath = `${projectName}/package.json`;
var pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
var pkgParsed = JSON.parse(pkgRead);

// Overwrite boilerplate defaults
pkgParsed.name = projectName;
pkgParsed.version = '0.0.1';
pkgParsed.description = projectName;
pkgParsed.author = 'Label A [labela.nl]';
pkgParsed.repository.url = '';
pkgParsed.keywords = [];

fs.writeFileSync(projectPkgPath, JSON.stringify(pkgParsed, null, 2));
