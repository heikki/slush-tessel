'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var _s = require('underscore.string');
var inquirer = require('inquirer');
var path = require('path');

var ports = ['A', 'B', 'C', 'D'];

var modules = {
	'accel-mma84'    : 'accel',
	'ambient-attx4'  : 'ambient',
	'audio-vs1053b'  : 'audio',
	'ble-ble113a'    : 'ble',
	'camera-vc0706'  : 'camera',
	'climate-si7005' : 'climate',
	'climate-si7020' : 'climate',
	'gprs-sim900'    : 'gprs',
	'gps-a2235h'     : 'gps',
	'ir-attx4'       : 'infrared',
	'relay-mono'     : 'relay',
	'rf-nrf24'       : 'nrf',
	'rfid-pn532'     : 'rfid',
	'sdcard'         : 'sdcard',
	'servo-pca9685'  : 'servo'
};

var choices = [{ name: '[ empty ]', value: false }].concat(Object.keys(modules));

var questions = ports.map(function(port) {
	return {
		type: 'list',
		name: port,
		message: 'Port ' + port,
		choices: choices
	};
}).concat({
	type: 'confirm',
	name: 'moveon',
	message: 'Continue?'
});

gulp.task('default', function(done) {

	gutil.log('Choose your modules:');

	inquirer.prompt(questions, function(answers) {

		if (!answers.moveon) {
			return done();
		}

		var vars = {};

		vars.slug = _s.slugify(path.basename(process.cwd()).replace(/[^\w\s]+?/g, ' '));

		vars.modules = ports.map(function(port) {
			var name = answers[port];
			var abbr = modules[name];
			var str = '\t\t' + port + ': ';
			if (name) {
				str += '[\'' + name + '\', \'' + abbr + '\']';
			} else {
				str += 'null';
			}
			return str;
		}).join(',\n');

		vars.dependencies = ports.map(function(port) {
			return answers[port];
		}).filter(function(value, index, self) {
			return value && self.indexOf(value) === index;
		}).concat('tesselate').sort().map(function(dep) {
			return '    "' + dep + '": "*"';
		}).join(',\n');

		gulp.src(__dirname + '/templates/**')
			.pipe(template(vars))
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'))
			.pipe(install())
			.on('finish', function() {
				done();
			});

		var skipInstall = process.argv.slice(2).indexOf('--skip-install') >= 0;

		if (!skipInstall) {
			process.on('exit', function() {
				console.log(gutil.colors.green('\nDONE! Connect your Tessel and try running \'gulp run\'\n'));
			});
		}

	});
});
