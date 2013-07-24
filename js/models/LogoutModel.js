define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var LogoutModel = Backbone.Model.extend({
        initialize: function() {
        },
        urlRoot: '/logout'
    });
    return LogoutModel;
});