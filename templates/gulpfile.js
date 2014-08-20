'use strict';

var fs   = require('fs');
var gulp = require('gulp');
var spawn = require('child_process').spawn;

var pkg = require('./package.json');

function callTessel(args, cb) {
	spawn('tessel', args, { stdio: 'inherit' }).on('close', function() {
		cb();
	});
}

gulp.task('prepare', function() {
	pkg.hardware = { './': false, '*': false };
	pkg.hardware['./' + pkg.main] = true;
	Object.keys(pkg.dependencies).forEach(function(key) {
		pkg.hardware[key] = true;
	});
	return fs.writeFile('./package.json', JSON.stringify(pkg, null, 2));
});

gulp.task('run', ['prepare'], function(cb) {
	callTessel(['run', pkg.main], cb);
});

gulp.task('push', ['prepare'], function(cb) {
	callTessel(['push', pkg.main], cb);
});
