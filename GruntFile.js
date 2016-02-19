module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            report: 'gzip', 
            target: {
                files: {
                    './dist/output.min.css': ['style/main.css',
                                   "lib/awesome/css/font-awesome.min.css",
                                   "lib/normalize.css",
                                   "lib/the-modal.css"]
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    './dist/output.min.js': [
                        "./lib/react.min.js"       ,
                        "./lib/jquery.min.js"      ,
                        "./lib/lodash.min.js"      ,
                        "./lib/lazy.js"            ,
                        "./lib/color-thief.min.js" ,
                        "./lib/jquery.the-modal.js",
                        "./lib/mousetrap.min.js"   ,
                        "./lib/mousetrap-global.min.js",
                        "./afterInit.js",
                        'src/GOO.js']
                }
            }
        },
        shell: {
            multiple: {
                command: [
                    'cp -r ./fonts ./dist/'
                ].join('&&')
            }
        }        
    })
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');
    // Default task(s).
    grunt.registerTask('build', ["cssmin","uglify","shell"]);

};
