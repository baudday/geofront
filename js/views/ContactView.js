define([
    "jquery",
    "underscore",
    "backbone",
    "forms/ContactForm",
    "text!../../templates/forms/ContactFormTemplate.html",
    "models/ContactModel"
], function($, _, Backbone, ContactForm, ContactFormTemplate, ContactModel){
    var that = this;
    var ContactView = Backbone.View.extend({
        el: '.body',
        render: function() {
            this.contactForm = new ContactForm({
                template: _.template(ContactFormTemplate),
                model: new ContactModel()
            }).render();

            this.$el.html(this.contactForm.el);

            this.contactForm.on('change', function(form) {
                $(".control-group").removeClass("error").addClass("success");
                $("#contactform :input").closest(".control-group").find(".text-error").html("");
                var errors = form.commit();
                if(errors) {
                    $.each(errors, function(key, value) {
                        $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        events: {
            'submit #contactform': 'sendContact'
        },
        sendContact: function(ev) {
            var errors = this.contactForm.commit();
            
            if(!errors) {
                this.newContact = $(ev.currentTarget).serializeForm();

                var contact = new ContactModel();
                contact.save(this.newContact, {
                    success: function(contact) {
                        $("#contact-error").hide();
                        $("#contact-error").removeClass("alert-error").addClass("alert-success").html("Thank you! We will be in touch shortly.").show();
                        $("#contactform :input").val("").removeClass("success");
                        $("#contactform :input").closest(".control-group").removeClass("success");
                    },
                    error: function(model, response) {
                        $("#contact-error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group").addClass("error");
                    $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        }
    });
    return ContactView;
});