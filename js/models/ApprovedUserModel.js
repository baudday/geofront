define([
    'jquery',
    'underscore',
    'backbone',
    'backboneForms'
], function($, _, Backbone, backboneForms){

    var ApprovedUserModel = Backbone.Model.extend({
        urlRoot: '/users/approve'
    });
    return ApprovedUserModel;
    
});