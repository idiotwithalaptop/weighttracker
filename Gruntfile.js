module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js',
        '!src/public/javascripts/material/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    clean: ['dist'],
    copy: {
       main: {
          options: {
             process: function (content, srcpath) {
                return content.replace('/src/', '/');
             }
          },
          files: [
             {
                src: 'bin/**', 
                dest: 'dist/',
                expand: true
             },
             {
                src: '**',   
                dest: 'dist/',
                expand: true,
                cwd: 'src'
             },
             {
                src: 'package.json',   
                dest: 'dist/'
             }
          ]
       } 
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: [
	'Gruntfile.js',
	'src/**/*.js',
	'test/**/*.js',
	'!src/public/javascripts/material/*.js'
      ],
	options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'concat', 'uglify']);

};
