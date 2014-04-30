define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var LoginForm = Backbone.Form.extend({
        schema: {
            username: {
                type: 'Text',
                title: 'Username',
                validators: [
                    'required'
                ]
            },
            password: {
                type: 'Password',
                title: 'Password',
                validators: [
                    'required'
                ]
            }
        }
    });

    return LoginForm;
});