define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){

    var ServiceModel = Backbone.Model.extend({
        urlRoot: '/services'
    });
    return ServiceModel;
});