requirejs.config({
    paths: {
        jquery: "lib/jquery/jquery",
        underscore: "lib/underscore-amd/underscore",
        backbone: "lib/backbone-amd/backbone",
        jquery: "lib/jquery/jquery",
        json2: "lib/json2/json2",
        bootstrap: "lib/bootstrap",
        templates: '../templates',
        serializeForm: 'lib/serializeForm',
        backboneForms: 'lib/backbone-forms.min',
        leaflet: 'lib/leaflet/dist/leaflet',
        jqcookie: 'lib/jquery-cookie/jquery.cookie',
        heatmap: 'lib/heatmapjs/heatmap',
        heatmapL: 'lib/heatmapjs/heatmap-leaflet',
        QuadTree: 'lib/heatmapjs/QuadTree'
    },
    shim: {
        'bootstrap': {deps: ['jquery']},
        'leaflet': {exports: 'L'},
        'jqcookie': {deps: ['jquery']},
        'heatmapL': {deps: ['leaflet', 'heatmap', 'QuadTree']}
    }
});

// Start the main app logic.
requirejs([
    'app',
    'backbone'
    ],
function   (App) {
    $.ajaxSetup({
        statusCode: {
            401: function() {
                if($.cookie('UserInfo')) {
                    // Log the user out whenever the server returns a 401.
                    Backbone.history.navigate("#/Logout");
                }
            }
        }
    });

    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        options.url = '//localhost:3000/api' + options.url
        options.xhrFields = {
            withCredentials: true
       }
    });

    App.initialize();
});