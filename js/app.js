define([
    "jquery", 
    "underscore", 
    "backbone",
    "router",
    "bootstrap",
    "text!../templates/header.html",
    "jqcookie",
    "pouchdb"
], function($, _, Backbone, Router, Bootstrap, HeaderTemplate, Cookie, PouchDB){
    return {
        initialize: function(){
            // Parse header
            var header = _.template(HeaderTemplate);

            // Set the header
            $('.header').html(header);

            // Bootstrap stuff to hide the menu on click
            $('.menu-button').on('click', function() {
                $('.btn-navbar').addClass('collapsed');
                $('.nav-collapse').removeClass('in').css('height', '0');
            });

            // Pass in our Router module and call it's initialize function
            Router.initialize();
        }
    }
});