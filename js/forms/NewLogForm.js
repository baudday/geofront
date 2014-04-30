define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewLogForm = Backbone.Form.extend({
        schema: {
            cluster: { 
                type: 'Select',
                title: 'Cluster',
                options: [
                    {val: '', label: 'Select One'},
                    {val: 'All', label: 'All Clusters'},
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
            message: {
                type: 'TextArea',
                title: 'Message',
                validators: [
                    'required'
                ]
            }
        }
    });

    return NewLogForm;
});