define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var ConfirmModel = Backbone.Model.extend({
        urlRoot: '/users/confirm'
    });
    
    return ConfirmModel;
});