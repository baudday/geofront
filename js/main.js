requirejs.config({
    paths: {
        config: "config",
        jquery: "lib/bower_components/jquery/jquery.min",
        underscore: "lib/bower_components/underscore/underscore-min",
        backbone: "lib/backbone-amd/backbone-min",
        json2: "lib/bower_components/json2/json2",
        bootstrap: "lib/bower_components/bootstrap/dist/js/bootstrap.min",
        serializeForm: "lib/serializeForm",
        backboneForms: "lib/backbone-forms.min",
        leaflet: "lib/bower_components/leaflet/dist/leaflet",
        jqcookie: "lib/bower_components/jquery-cookie/jquery.cookie",
        heatmap: "lib/heatmapjs/heatmap",
        heatmapL: "lib/heatmapjs/heatmap-leaflet",
        QuadTree: "lib/heatmapjs/QuadTree",
        pouchdb: "lib/pouchdb/dist/pouchdb-nightly.min",
        CouchRest: "lib/CouchRest/CouchRest",
        IDBTilesLayer: "lib/IDBTilesLayer/L.TileLayer.IDBTiles",
        ReliefMap: "lib/ReliefMap/ReliefMap"
    },
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery']
        },
        leaflet: {
            exports: 'L'
        },
        jqcookie: {
            deps: ['jquery']
        },
        heatmapL: {
            deps: ['leaflet', 'heatmap', 'QuadTree']
        },
        IDBTilesLayer: {
            deps: ['leaflet']
        },
        pouchdb: {
            exports: 'Pouch'
        },
        config: {
            exports: 'config'
        },
        backboneForms: {
            deps: ['jquery', 'underscore', 'backbone']
        },
        serializeForm: {
            deps: ['jquery']
        }
    }
});

// Start the main app logic.
requirejs([
    "app",
    "config"
    ],
function (App, config) {
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

