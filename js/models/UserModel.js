define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){

    var UserModel = Backbone.Model.extend({
        urlRoot: '/users'
    });
    
    return UserModel;
});