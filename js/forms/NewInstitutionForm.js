define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewInstitutionForm = Backbone.Form.extend({
        schema: {
            name: { 
                type: 'Text',
                title: 'Institution Name', 
                validators: [
                    'required'
                ] 
            },
            url: {
                type: 'Text',
                dataType: 'url',
                title: 'Institution URL',
                validators: [
                    'required'
                ]
            },
            description: {
                type: 'TextArea',
                title: 'Institution Description',
                validators: [
                    'required'
                ]
            }
        }
    });

    return NewInstitutionForm;
});