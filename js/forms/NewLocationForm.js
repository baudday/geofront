define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewLocationForm = Backbone.Form.extend({
        schema: {
            name: { 
                type: 'Text',
                title: 'Location Name',
                validators: [
                    'required'
                ]
            },
            lat: { 
                type: 'Text',
                title: 'Latitude', 
                validators: [
                    'required'
                ] 
            },
            lon: { 
                type: 'Text',
                title: 'Longitude', 
                validators: [
                    'required'
                ] 
            },
            amenity: {
                type: 'Select',
                title: 'Location Type',
                options: [
                    {val: '', label: 'Select One'},
                    {val: 'school', label: 'School'},
                    {val: 'medicine', label: 'Medicine'},
                    {val: 'camp', label: 'Camp'},
                    {val: 'water', label: 'Water'}
                ],
                validators: [
                    'required'
                ]
            },
            population: {
                type: 'Number',
                title: 'Population',
                validators: [
                ]
            },
            notes: {
                type: 'TextArea',
                title: 'Notes',
                validators: [
                ]
            }
        }
    });

    return NewLocationForm;
});