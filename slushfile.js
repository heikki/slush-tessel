'use strict';

var gulp = require('gulp');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var inquirer = require('inquirer');
var path = require('path');
var _ = require('underscore.string');
var npm = require('npm');

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

gulp.task('npm-install', function(done) {
	npm.load(function() {
		npm.commands.install(function(error) {
			if (error) {
				console.log('npm', error.message);
				return;
			}
			done();
		});
	});
});

gulp.task('default', function(done) {

	var choices = [{ name: '[ empty ]', value: false }].concat(Object.keys(modules));

	var questions = [{
		name: 'name',
		message: 'Name of project',
		default: _.humanize(path.basename(process.cwd()))
	}];

	ports.forEach(function(port) {
		questions.push({
			type: 'list',
			name: port,
			message: 'Port ' + port + ' module',
			choices: choices
		});
	});

	questions.push({
		type: 'confirm',
		name: 'moveon',
		message: 'Continue?'
	});

	inquirer.prompt(questions, function(answers) {

		if (!answers.moveon) {
			return done();
		}

		answers.slug = _.slugify(answers.name);

		answers.modules = ports.map(function(port) {
			var name = answers[port];
			return { port: port, name: name, abbr: modules[name] };
		});

		answers.dependencies = ports.map(function(port) {
			return answers[port];
		}).filter(function(value, index, self) {
			return value && self.indexOf(value) === index;
		}).concat('tesselate').sort();

		gulp.src(__dirname + '/templates/**')
			.pipe(template(answers))
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'))
			.on('finish', function() {
				gulp.start(['npm-install'], done);
			});

	});
});
