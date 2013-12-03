define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){

    var ContactModel = Backbone.Model.extend({
        urlRoot: '/contact'
    });
    
    return ContactModel;
});