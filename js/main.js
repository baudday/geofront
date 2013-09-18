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
        QuadTree: 'lib/heatmapjs/QuadTree',
        pouchdb: 'lib/pouchdb/src/pouchdb-nightly.min',
        backbonePouch: 'lib/backbone-pouch/backbone-pouch'
    },
    shim: {
        'bootstrap': {deps: ['jquery']},
        'leaflet': {exports: 'L'},
        'jqcookie': {deps: ['jquery']},
        'heatmapL': {deps: ['leaflet', 'heatmap', 'QuadTree']},
        'pouchdb': {exports: 'Pouch'},
        'backbonePouch': {deps: ['pouchdb'], exports: 'BackbonePouch'},
    }
});

// Start the main app logic.
requirejs([
    'app',
    'pouchdb'
    ],
function   (App, PouchDB) {
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
        options.url = '//localhost:3000/api' + options.url
        options.xhrFields = {
            withCredentials: true
       }
    });

    App.initialize();
});