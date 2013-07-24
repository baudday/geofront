define([
    'jquery',
    'underscore',
    'backbone',
    'backboneForms'
], function($, _, Backbone, backboneForms){
    var NewAreaForm = Backbone.Form.extend({
        schema: {
            query: { 
                type: 'Text',
                title: 'Search'
            }
        }
    });

    return NewAreaForm;
});