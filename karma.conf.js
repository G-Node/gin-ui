// Karma configuration
// Generated on Mon Apr 03 2017 21:01:21 GMT+0200 (CEST)

module.exports = function(config) {
    let cl = {}
    let testBrowsers = ["Opera", "Chromium", "Firefox"]
    if (process.env.TRAVIS && process.env.TRAVIS_OS_NAME === "linux") {
        testBrowsers = ["Chrome", "Firefox", "Opera"]
        cl = {
            Chrome_without_sandbox: { base: "Chrome", flags: ["--no-sandbox"] },
            Firefox_without_sandbox: { base: "Firefox", flags: ["--no-sandbox"] },
            Opera_without_sandbox: { base: "Opera", flags: ["--no-sandbox"] }
        }
        if (process.env.COVERALLS === 1) {
            testBrowsers = ["Firefox"]
            cl = { Firefox_without_sandbox: { base: "Firefox", flags: ["--no-sandbox"] } }
        }
    } else if (process.env.TRAVIS && process.env.TRAVIS_OS_NAME === "osx") {
        testBrowsers = ["Safari", "Firefox", "Chrome"]
    } else if (process.env.APPVEYOR) {
        testBrowsers = ["IE", "Firefox", "Chrome"]
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "browserify"],

        // list of files / patterns to load in the browser
        files: [
            {pattern: "test/**/*.js", included: true}
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "test/**/*.js": ["browserify"]
        },

        // Browserify configuration
        // The coverage command goes here instead of the preprocessor because we need it to work with browserify
        browserify: {
            debug: true,
            transform: [
                ["babelify",
                    {
                        presets: "es2015"
                    },
                    "vueify"
                ],
                [
                    "browserify-istanbul",
                    {
                        instrumenterConfig: {
                            embedSource: true
                        }
                    }
                ]
            ]
        },

        coverageReporter: {
            reporters: [
                {"type": "text"},
                {"type": "html", dir: "coverage"},
                {"type": "lcov"}
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "mocha", "coverage"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: testBrowsers,

        // docker build supposedly fails chrome builds with sandbox active
        customLaunchers: cl,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Increase timeout to accommodate Travis CI issue.
        // Got timeout with the travis suggestion of 60000 for Safari on osx build.
        browserNoActivityTimeout: 100000,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
