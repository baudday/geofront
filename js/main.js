requirejs.config({
    paths: {
        config: "config",
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
        QuadTree: 'lib/heatmapjs/QuadTree',
        pouchdb: 'lib/pouchdb/src/pouchdb-nightly.min',
        backbonepouch: 'lib/backbone-pouch/backbone-pouch'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'leaflet': {
            exports: 'L'
        },
        'jqcookie': {
            deps: ['jquery']
        },
        'heatmapL': {
            deps: ['leaflet', 'heatmap', 'QuadTree']
        },
        'pouchdb': {
            exports: 'Pouch'
        },
        'backbonepouch': {
            deps: ['pouchdb'], 
            exports: 'BackbonePouch'
        },
        'config': {
            exports: 'config'
        }
    }
});

// Start the main app logic.
requirejs([
    'app',
    'pouchdb',
    'backbonepouch',
    'config'
    ],
function   (App, PouchDB, BackbonePouch, config) {
    window.offline = false;
    $.ajaxSetup({
        complete: function(response) {
            if (response.status === 0) {
                // Set offline flag to true when status of 0 is received
                window.offline = true;
            } else if (response.status === 401) {
                if($.cookie('UserInfo')) {
                    // Log the user out whenever the server returns a 401.
                    Backbone.history.navigate("#/Logout");
                }
            } else {
                window.offline = false;
            }
        }
    });

    $.ajaxPrefilter('json', function(options, originalOptions, jqXHR) {
        options.url = config.baseApiUrl + options.url
        options.xhrFields = {
            withCredentials: true
       }
    });

    App.initialize();
});