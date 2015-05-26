/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function (grunt) {
   'use strict';

   var path = require( 'path' );

   var pkg = grunt.file.readJSON( 'package.json' );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var banner = '/** Copyright 2015 aixigo AG, Released under the MIT license: http://laxarjs.org/license */';

   // mark dependencies that will be satisfied by other bundles
   var DEFER = 'empty:';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var base = {
      baseUrl: 'bower_components',
      name: pkg.name,
      packages: [ {
         name: pkg.name,
         location: pkg.name,
         main: pkg.name
      } ],
      exclude: [ 'text', 'json' ],
      include: [
         'laxar-uikit/controls/html-attribute/ax-html-attribute-control',
         'laxar-uikit/controls/i18n/ax-i18n-control'
      ],
      paths: {
         text: 'requirejs-plugins/lib/text',
         json: 'requirejs-plugins/src/json',

         // provided with laxar:
         laxar: DEFER,
         angular: DEFER,
         'angular-sanitize': DEFER,

         moment: DEFER
      },
      out: 'dist/' + pkg.name,
      optimize: 'none',
      generateSourceMaps: false
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.initConfig( {
      requirejs: {
         options: base,

         // Just LaxarJS UIKit itself, no dependencies
         // Allows (and requires) you to configure all dependencies yourself.
         'default': {
            options: {
               out: base.out + '.js'
            }
         }
      },

      // For the non-testing bundles, create minified versions as well:
      uglify: {
         options: {
            sourceMap: true,
            banner: banner
         },

         'default': {
            files: {
               'dist/laxar-uikit.min.js': [ 'dist/laxar-uikit.js' ]
            }
         }
      },

      copy: {
         controls: {
            expand: true,
            mode: true,
            timestamp: true,
            cwd: path.join( 'bower_components', pkg.name ),
            src: 'controls/**',
            dest: 'dist/'
         },
         themes: {
            expand: true,
            mode: true,
            timestamp: true,
            cwd: path.join( 'bower_components', pkg.name ),
            src: [ 'themes/**', '!themes/*/{scss,compass}/**' ],
            dest: 'dist/'
         }
      }
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.loadNpmTasks( 'grunt-contrib-copy' );
   grunt.loadNpmTasks( 'grunt-contrib-uglify' );
   grunt.loadNpmTasks( 'grunt-laxar' );

   grunt.registerTask( 'dist', [ 'requirejs', 'uglify', 'copy' ] );

};
