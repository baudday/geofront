define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var AreaFilterForm = Backbone.Form.extend({
        schema: {
            filterareaselect: {
                type: 'Select',
                id: 'filterareaselect',
                title: 'Jump to Relief Area',
                options: [],
                validators: [
                    'required'
                ]
            }
        }
    });

    return AreaFilterForm;
});