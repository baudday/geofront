define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){

    var LocationModel = Backbone.Model.extend({
        urlRoot: '/locations'
    });
    
    return LocationModel;
});