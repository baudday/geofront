define([
    "jquery",
    "underscore",
    "backbone",
    "backboneForms"
], function($, _, Backbone, backboneForms){
    var NewAreaForm = Backbone.Form.extend({
        schema: {
            areaname: { 
                type: 'Text',
                title: 'Area Name', 
                validators: [
                    'required'
                ] 
            }
        }
    });

    return NewAreaForm;
});