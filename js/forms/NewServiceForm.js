define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewServiceForm = Backbone.Form.extend({
        schema: {
            cluster: { 
                type: 'Select',
                title: 'Cluster',
                options: [
                    {val: '', label: 'Select One'},
                    {val: 'Shelter', label: 'Shelter'},
                    {val: 'Nutrition', label: 'Nutrition'},
                    {val: 'Water', label: 'Water'},
                    {val: 'Health', label: 'Health'},
                    {val: 'Food', label: 'Food'},
                    {val: 'Logistics', label: 'Logistics'},
                    {val: 'Protection', label: 'Protection'},
                    {val: 'CCM', label: 'CCM'},
                    {val: 'Education', label: 'Education'}
                ],
                validators: [
                    'required'
                ]
            },
            stage: { 
                type: 'Select',
                title: 'Stage',
                options: [
                    {val: "", label: "Select One"},
                    {val: "Assessment", label: "Assessment"},
                    {val: "Planned", label: "Planned"},
                    {val: "Commenced", label: "Commenced"}
                ],
                validators: [
                    'required'
                ]
            },
            description: {
                type: 'TextArea',
                title: 'Description',
                editorAttrs: {
                    maxlength: 140
                },
                validators: [
                    'required'
                ]
            },
            contact: { 
                type: 'Select',
                title: 'Primary Contact',
                options: [],
                validators: [
                    'required'
                ]
            }
        }
    });

    return NewServiceForm;
});