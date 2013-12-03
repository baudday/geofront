define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){

    var AreaModel = Backbone.Model.extend({
        urlRoot: '/areas'
    });
    return AreaModel;
    
});