define([
    'jquery',
    'underscore',
    'backbone',
    'backboneForms'
], function($, _, Backbone, backboneForms){
    var AddApprovedUserForm = Backbone.Form.extend({
        schema: {
            email: {
                type: 'Text',
                title: 'Email Address',
                validators: [
                    'required',
                    'email'
                ]
            }
        }
    });
    
    return AddApprovedUserForm;
});