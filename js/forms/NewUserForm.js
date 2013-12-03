define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewUserForm = Backbone.Form.extend({
        schema: {
            first: { 
                type: 'Text',
                title: 'First Name', 
                validators: [
                    'required'
                ] 
            },
            last: {
                type: 'Text',
                title: 'Last Name',
                validators: [
                    'required'
                ]
            },
            email: {
                type: 'Text',
                title: 'Email Address',
                validators: [
                    'required',
                    'email'
                ]
            },
            phone: {
                dataType: 'tel',
                title: 'Phone',
                editorAttrs: {
                    pattern: ".{10,}"
                },
                validators: [
                    'required'
                ]
            },
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
            },
            confirm: {
                type: 'Password',
                title: 'Confirm Password',
                validators: [
                    'required',
                    {
                        type: 'match',
                        field: 'password'
                    }
                ]
            },
            institution: {
                type: 'Select',
                title: 'Institution',
                options: [],
                validators: [
                    'required'
                ]
            }
        }
    });

    return NewUserForm;
});