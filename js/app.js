define([
    'jquery', 
    'underscore', 
    'backbone',
    'router', // Request router.js
    'bootstrap',
    'text!templates/header.html',
    'jqcookie'
], function($, _, Backbone, Router, Bootstrap, HeaderTemplate, Cookie){
    var initialize = function(){
        // Parse header
        var header = _.template(HeaderTemplate);

        // Set the header
        $('.header').html(header);

        // Pass in our Router module and call it's initialize function
        Router.initialize();
    };

    return { 
        initialize: initialize
    };
});