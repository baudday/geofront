define([
    'jquery',
    'validation'
], function($, Validation) {
    $(document).ready(function() {
        $("#register").validate({
            errorClass: "control-label",
            rules: {
                first_name: {
                    required: true,
                    minlength: 2
                },
                last_name: {
                    required: true,
                    minlength: 2
                },
                username: {
                    required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirm: {
                    required: true,
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                institution: {
                    required: true
                },
                inst_key: {
                    required: true,
                    minlength: 36
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name.",
                    minlength: "First name must be at least 2 characters long.",
                },
                last_name: {
                    required: "Please enter your last name.",
                    minlength: "Last name must be at least 2 characters long."
                },
                username: {
                    required: "Please enter a username.",
                    minlength: "Username must be at least 4 characters long."
                },
                password: {
                    required: "Please enter a password.",
                    minlength: "Password must be at least 6 characters long."
                },
                confirm: {
                    required: "Please confirm your password.",
                    equalTo: "Passwords must match."
                },
                email: {
                    required: "Please enter your email address.",
                    email: "Invalid email address."
                },
                institution: {
                    required: "Please select the institution you are affiliated with.",
                },
                inst_key: {
                    required: "Please enter the key connected to your institution.",
                    minlength: "You have entered an invalid key"
                }
            },
            highlight: function(element) {
                $(element).closest('.control-group').removeClass('success').addClass('error');
            },
            success: function(element) {
                element
                .closest('.control-group').removeClass('error').addClass('success');
            }
        });

        $("#changepass").validate({
            errorClass: "control-label",
            rules: {
                oldpass: {
                    required: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirm: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                oldpass: {
                    required: "Please enter your current password"
                },
                password: {
                    required: "Please enter a password.",
                    minlength: "Password must be at least 6 characters long."
                },
                confirm: {
                    required: "Please confirm your password.",
                    equalTo: "Passwords must match."
                }
            },
            highlight: function(element) {
                $(element).closest('.control-group').removeClass('success').addClass('error');
            },
            success: function(element) {
                element
                .closest('.control-group').removeClass('error').addClass('success');
            }
        });

        $("#addinst").validate({
            errorClass: "control-label",
            rules: {
                instname: {
                    required: true,
                    minlength: 2
                },
                insturl: {
                    required: true,
                    minlength: 7
                },
                instdescription: {
                    required: true,
                    minlength: 20
                }
            },
            messages: {
                instname: {
                    required: "Please enter a name.",
                    minlength: "Name must be at least 2 characters long."
                },
                insturl: {
                    required: "Please enter a URL.",
                    minlength: "URL must be at least 6 characters long."
                },
                instdescription: {
                    required: "Please enter a description.",
                    minlength: "Description must be at least 20 characters long."
                }
            },
            highlight: function(element) {
                $(element).closest('.control-group').removeClass('success').addClass('error');
            },
            success: function(element) {
                element
                .closest('.control-group').removeClass('error').addClass('success');
            }
        });
        
        $("#username").focus(function() {
            var first = $("#first_name").val();
            var last = $("#last_name").val();
            var username = first + "." + last;
            if(first && last && !$(this).val()) {
                $(this).val(username.toLowerCase());
            }
        });

        $("#inst_key").keyup(function() {
            var str = $(this).val();
            var length = str.length;

            var ch = str.charAt(length - 1);

            if(length == 8 || length == 13 || 
               length == 18 || length == 23) {
                $(this).val($(this).val() + "-");
            }

            if(ch.match(/[^a-zA-Z0-9 ]/g)) {
                $(this).val(str.substring(0, length - 1));
            }
        });
    });
});