define([
    'jquery',
    'underscore',
    'backbone',
    'backboneForms'
], function($, _, Backbone, backboneForms){
    var NewInstitutionForm = Backbone.Form.extend({
        schema: {
            name: { 
                type: 'Text',
                title: 'Name', 
                validators: [
                    'required'
                ] 
            },
            email: {
                type: 'Text',
                title: 'Email',
                validators: [
                    'required',
                    'email'
                ]
            },
            subject: {
                type: 'Select',
                title: 'Regarding',
                options: [
                    {val: '', label: 'Select One'},
                    {val: 'adminForInst', label: 'Institution Admin Priveleges'},
                    {val: 'bugReport', label: 'Report a Bug'},
                    {val: 'feedback', label: 'Question/Comment'}
                ],
                validators: [
                    'required'
                ]
            },
            message: {
                type: 'TextArea',
                title: 'Message',
                validators: [
                    'required'
                ]
            }
        }
    });

    return NewInstitutionForm;
});