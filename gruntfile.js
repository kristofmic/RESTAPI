module.exports = gruntConfig;

function gruntConfig(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    mochaTest: require('./grunt/mocha_test')
  });

  for (var task in pkg.devDependencies) {
    if (task !== 'grunt' && !task.indexOf('grunt')) {
      grunt.loadNpmTasks(task);
    }
  }

  grunt.registerTask('test:dev', [
    'mochaTest:dev',
    'mochaTest:cov'
  ]);
  grunt.registerTask('default', [
    'test:dev'
  ]);
}