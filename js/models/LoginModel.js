define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){

    var LoginModel = Backbone.Model.extend({
        initialize: function() {
        },
        urlRoot: '/login'
    });
    return LoginModel;
});