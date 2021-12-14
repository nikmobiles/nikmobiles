(function ($) {

    $.flirtplek = {
        temp: new Array(),
        ajaxPath: '/ajax/',
        authenticated: false,

        profileVisitIntervalId: 0,
        profileVisitTimerId:    0,
        defaultinterval:        2000,

        doAction: function (remoteHandler, data, action, successHandler, errorHandler) {
            if(data == null)
                data = {};

            if(action != null)
                data.action = action;

            $.post(
                this.ajaxPath + remoteHandler + '?callback=?',
                data,
                function (response) {
                    $.flirtplek.responseHandler(response, successHandler, errorHandler);
                },
                'jsonp');
        },
        responseHandler: function (response, successHandler, errorHandler) {
            if(!response.ok) {
                if(errorHandler != null && typeof(errorHandler) == 'function') {
                    errorHandler(response.errors, response.data);
                }
                else this.errorHandler(response.errors, response.data);
            }
            else {
                if(successHandler != null && typeof(successHandler) == 'function' && response.ok) {
                    successHandler(response.data);
                }
                else this.successHandler(response.data);

                // handle redirect when needed
                if(response.redirect != null && response.redirect != "") {
                    location.href = response.redirect;
                    return true;
                }

                // handle refresh when needed
                if(response.reload) {
                    location.reload();
                    return true;
                }
            }
        },
        successHandler: function (data) {
            this.log(data);
        // default success handler code here.
        },
        errorHandler: function (errors) {
            this.log(errors);
            var errText = 'Er is een fout opgetreden\n';
            for(var i in errors)
                errText += ' - ' + ((errors[i].desc != null) ? errors[i].desc : errors[i].code) + '\n';
            alert(errText);
        },
        log: function (obj) {
            if(typeof(console) != 'undefined' && typeof(console.log) != 'undefined')
                console.log(obj);
        },
        waiting: function () {
            $('body').css('cursor', 'wait');
        },
        stopWaiting: function () {
            $('body').css('cursor', 'default');
        },
        doUpload: function (remoteHandler, data, action, fileInputId, successHandler, errorHandler) {
            if(data == null)
                data = {};

            if(action != null)
                data.action = action;

            $.ajaxFileUpload({
                url: this.ajaxPath + remoteHandler,
                data: data,
                secureuri: false,
                fileElementId: fileInputId,
                dataType: 'json',
                success: function (response, status, fileName) {
                    eval('response = ' + response);
                    if ( response.data == null ) {
                        response.data = {
                            originalFile: fileName
                        };
                    } else {
                        response.data.originalFile = fileName;
                    }
                    $.flirtplek.responseHandler(response, successHandler, errorHandler);
                }
            });
        },
        handlers: {
            contactSuccess: function (data) {
                $.flirtplek.stopWaiting();
                $('.button').removeAttr('disabled');
                $('#content_default').fadeOut('fast', function () {
                    $('.content_success_name').text(data.name);
                    if ($('#contact_subject').find(":selected").val()=='overige') {
                        $('#content_success_overige').fadeIn('fast');
                    }
                    else {
                        $('#content_success_automatic').fadeIn('fast');
                    }
                });
            },
            contactErrors: function (errors) {
                $.flirtplek.stopWaiting();
                $('.button').removeAttr('disabled');
                $('#errors').stop().html('');
                for(var i=0; i < errors.length; i++) {
                    $('#errors').append($('<div class="error">').html(errors[i].desc).addClass(errors[i].code));
                    $('#contact_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                        $(this).removeClass('error').unbind('focus');
                    });
                }
                $('#errors').slideDown('fast');
            },
            checkPinSuccess: function (data) {
                $('.button-checkpin').show();
                $("body").css("cursor", "auto");
                $('.button-sendMessage').removeAttr('disabled');
                $('#box_phone_nl,#box_phone_be').slideUp(function(){
                    $('.button-sendMessage').click();
                });
            },
            checkPinErrors: function (errors) {
                $('.button-checkpin').show();
                $("body").css("cursor", "auto");
                $('.error').fadeIn();
            },
            attachmentSuccess: function (data) {
                var attachmentData = data;
                data = {
                    to: $('.button-sendMessage').attr('rel'),
                    msgid: $('.message-id').val(),
                    subject: $('.message-subject').val(),
                    message: $('.message-content').val(),
                    attachment: attachmentData
                };
                $.flirtplek.doAction('message', data, 'send',
                    $.flirtplek.handlers.sendMessageSuccess,
                    $.flirtplek.handlers.sendMessageErrors);
            },
            attachmentErrors: function (errors,data) {
                $('.button-sendMessage').removeAttr('disabled');
                var replace = null;
                if ( undefined !== data.originalFile ) {
                    replace = data.originalFile;
                }
                for(var i=0; i < errors.length; i++) {
                    var errorMessage = (errors[i].desc != null ? errors[i].desc : errors[i].code);
                    errorMessage = errorMessage.replace('%s',replace);
                    errors[i].desc = errorMessage;
                }
                $.flirtplek.errorHandler(errors);
            },
            flirtSuccess: function(data) {
                var remaining = data.flirtsLeft;
                $('#box_flirt_status.box_flirt_error, #box_flirt_status .box_flirt_success').hide();
                $('#box_flirt_status .flirt_sent').show();
                $('#box_flirt_status .flirt_sent .flirts-left').html(remaining);
                $('#box_flirt_status').slideDown();
            },
            flirtErrors: function(errors, data) {
                var errCode = errors[0].code;
                if(errCode == 'max_flirts_reached' || errCode == 'one_flirt_per_profile' || errCode == 'conversation_already_started') {
                    $('#box_flirt_status.box_flirt_error, #box_flirt_status .box_flirt_success').hide();
                    $('#box_flirt_status .' + errCode).show();
                    $('#box_flirt_status').slideDown();
                }
                else $.flirtplek.errorHandler(errors);
            },
            sendMessageSuccess: function (data) {
                $.flirtplek.log(data);
            },
            sendMessageErrors: function (errors, data) {
                $.flirtplek.log(errors);
                if(errors[0].code == 'insufficient_credits') {
                    $('.message-id').val(data.msgid);
                    $('.dial-default').slideDown();
                } else {
                    $('.button-sendMessage').removeAttr('disabled');
                    $.flirtplek.errorHandler(errors);
                }
            },
            deleteMessagesSuccess: function (data) {
                $.flirtplek.log(data);
                for ( var $i = 0; $i < data.messageIds.length; $i++ ) {
                    $('#message-'+data.messageIds[$i]).slideUp('fast');
                }
            },
            deleteMessagesErrors: function (errors) {
                $.flirtplek.log(errors);
            },

            newsletterSuccess:  function(data) {
                var successMessage, successDetails, successContainer;

                $('.subscription-message').fadeOut(function(){
                    $(this).html(data.content.message).fadeIn();
                });
                $('.newsletter-box fieldset legend').fadeOut(function(){
                    $(this).html(data.content.title).fadeIn();
                });
                $('.subscription-action').fadeOut(function(){
                    $(this).html(data.content.action).fadeIn();
                });

                if(data.action === 'subscribe') {
                    successMessage = 'Je bent nu aangemeld.';
                    successDetails = 'Vanaf nu zal je de nieuwsbrief ontvangen.';
                }
                if(data.action === 'unsubscribe') {
                    successMessage = 'Je bent nu afgemeld';
                    successDetails = 'Vanaf nu zal je geen nieuwsbrief meer ontvangen.';
                }
                if($('.account-success').length > 0) {
                    successContainer = $('.account-success').empty();
                } else {
                    successContainer = $('<div />').attr('class', 'account-success');
                }
                successContainer.hide().append(
                    $('<div />').addClass('success').text(successMessage)
                ).append(
                    $('<div />').addClass('success_nonbold').text(successDetails)
                ).insertAfter('.newsletter-box fieldset legend').slideDown();
            },

            newsletterErrors:   function(data) {
                alert('Als je deze alert ziet, is er iets ernstig mis.');
            },

            photoUploadSuccess: function(data) {
                $('<img>').appendTo('#photoUpload-thumbs').
                attr('class','photoUpload-thumb').
                attr('src',data.url);
                if ( undefined == $.flirtplek.temp['photoUploadSuccess']) {
                    $.flirtplek.temp['photoUploadSuccess'] = 0;
                }
                $.flirtplek.temp['photoUploadSuccess']++;
                $errorCount = 0;
                if ( undefined != $.flirtplek.temp['photoUploadErrors']) {
                    $errorCount = $.flirtplek.temp['photoUploadErrors'];
                }
                if ( ($errorCount + $.flirtplek.temp['photoUploadSuccess']) >=
                    $.flirtplek.temp['photoUploadAmount'] ) {
                    $.flirtplek.handlers.photoUploadComplete();
                }
            },
            photoUploadErrors: function(errors, data) {
                var replace = null;
                if ( undefined !== data.originalFile ) {
                    replace = data.originalFile;
                }
                if ( undefined === $.flirtplek.temp['photoUploadErrors'] ||
                    $.flirtplek.temp['photoUploadErrors'] == 0) {
                    $.flirtplek.temp['photoUploadErrors'] = 0;
                    $.flirtplek.temp['photoUploadErrorData'] = new Array();
                }
                $.flirtplek.temp['photoUploadErrors']++;

                //$.flirtplek.temp['photoUploadErrorData']
                for(var i=0; i < errors.length; i++) {
                    var errorMessage = (errors[i].desc != null ? errors[i].desc : errors[i].code);
                    errorMessage = errorMessage.replace('%s',replace);
                    $.flirtplek.temp['photoUploadErrorData'].push(errorMessage);
                }

                $successCount = 0;
                if ( undefined != $.flirtplek.temp['photoUploadSuccess']) {
                    $successCount = $.flirtplek.temp['photoUploadSuccess'];
                }
                if ( ($successCount + $.flirtplek.temp['photoUploadErrors']) >=
                    $.flirtplek.temp['photoUploadAmount'] ) {
                    $.flirtplek.handlers.photoUploadComplete();
                }


            },
            photoUploadComplete: function() {
                $('.photoUpload-button').removeAttr('disabled');
                $.flirtplek.stopWaiting();
                if ( undefined !== $.flirtplek.temp['photoUploadSuccess'] &&
                    $.flirtplek.temp['photoUploadSuccess'] > 0 ) {
                    $.flirtplek.temp['photoUploadSuccess'] = 0;
                    $('.photoUpload-success').slideDown('fast').delay(5000).slideUp('fast');
                }
                if ( undefined !== $.flirtplek.temp['photoUploadErrors'] &&
                    $.flirtplek.temp['photoUploadErrors'] > 0 ) {
                    $.flirtplek.temp['photoUploadErrors'] = 0;
                    var errors = $.flirtplek.temp['photoUploadErrorData'];
                    $.flirtplek.temp['photoUploadErrorData'] = null;
                    $('.photoUpload-errors').stop().html('');
                    for(var i=0; i < errors.length; i++) {
                        errorMessage = errors[i];
                        $('.photoUpload-errors').append($('<div class="error">').html(errorMessage).addClass(errors[i].code));
                        $('#abuse_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                            $(this).removeClass('error').unbind('focus');
                        });
                    }
                    $('.photoUpload-errors').slideDown('fast');
                }
            },
            reportAbuseSuccess: function(data) {
                $.flirtplek.stopWaiting();
                $('.button').removeAttr('disabled');
                $('#content_default').fadeOut('fast', function () {
                    $('#content_success_name').html(data.name);
                    $('#content_success').fadeIn('fast');
                });
            },
            reportAbuseErrors: function (errors) {
                $.flirtplek.stopWaiting();
                $('.button').removeAttr('disabled');
                $('#errors').stop().html('');
                for(var i=0; i < errors.length; i++) {
                    $('#errors').append($('<div class="error">').html(errors[i].desc).addClass(errors[i].code));
                    $('#abuse_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                        $(this).removeClass('error').unbind('focus');
                    });
                }
                $('#errors').slideDown('fast');
            },
            requestPasswordSuccess: function (data) {
                $.flirtplek.stopWaiting();
                $('.forgotpass-success').html(data);
            },
            requestPasswordErrors: function (errors) {
                $.flirtplek.stopWaiting();
                $('.forgotpass-error').html(errors[0].desc);
            },
            registrationErrors: function (errors) {
                $.flirtplek.stopWaiting();
                $('.button-register').removeAttr('disabled');
                $('#errors').stop().html('');
                for(var i=0; i < errors.length; i++) {
                    $('#errors').append($('<div class="error">').html(errors[i].desc != null ? errors[i].desc : errors[i].code).addClass(errors[i].code));
                    $('#registration_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                        $(this).removeClass('error').unbind('focus');
                    });

                    if (errors[i].field != null && errors[i].field.length > 0) {
                        $('input[name="clientname"]').val(errors[i].field);
                    }
                }
                $('#errors').slideDown('fast');
            },
            registrationSuccess: function(data) {
                $.flirtplek.stopWaiting();
                $('.button-register').removeAttr('disabled');
                $('.register-input').each(function(){
                    if ( $(this).attr('name') == 'clientname' ) {
                        $('#registerSuccessName').html($(this).val());
                    }
                    $(this).val('');
                });
                $('#registerData').slideUp('fast', function(){
                    $('#registerSuccess').slideDown('fast');
                });
            },
            accountUpdateSuccess: function(data) {
                $.flirtplek.stopWaiting();
                $('.button-account').removeAttr('disabled');
                $('html, body').animate({
                    scrollTop:0
                }, 'fast', null, function(){
                    if($('input[name="geboren"]').val() != '1980-01-01' && $('input[name="geboren"]').val() != '')
                    {
                        $('.geboren-day, .geboren-month, .geboren-year').attr('disabled','disabled');
                    }
                    else {
                        $(".geboren-day, .geboren-month").val('01');
                        $('.geboren-year').val('1980');
                    }

                    if($('select[name="geslacht"]').val() != '')
                        $('select[name="geslacht"]').attr('disabled','disabled');

                    $('#account-success').slideDown('fast');
                });

            },
            accountUpdateErrors: function (errors) {
                $.flirtplek.stopWaiting();
                $('.button-account').removeAttr('disabled');
                $('#account-errors').stop().html('');
                for(var i=0; i < errors.length; i++) {
                    $('#account-errors').append($('<div class="error">').html(errors[i].desc != null ? errors[i].desc : errors[i].code).addClass(errors[i].code));
                    $('#update_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                        $(this).removeClass('error').unbind('focus');
                    });
                }
                $('html, body').animate({
                    scrollTop:0
                }, 'fast', null, function(){
                    $('#account-errors').slideDown('fast');
                });
            },
            changePasswordSuccess: function(data) {
                $.flirtplek.stopWaiting();
                $('.button-changePassword').removeAttr('disabled');
                $('.change-password-inputs').each(function(){
                    $(this).val('');
                })
                $('#changePassword-success').slideDown('fast');
            },
            changePasswordErrors: function(errors) {
                $.flirtplek.stopWaiting();
                $('.button-changePassword').removeAttr('disabled');
                $('#changePassword-errors').stop().html('');
                for(var i=0; i < errors.length; i++) {
                    $('#changePassword-errors').append($('<div class="error">').html(errors[i].desc != null ? errors[i].desc : errors[i].code).addClass(errors[i].code));
                    $('#password_'+errors[i].field).addClass('error').bind('focus', function (evt) {
                        $(this).removeClass('error').unbind('focus');
                    });
                }
                $('#changePassword-errors').slideDown('fast');
            },
            accountDeleteErrors: function(errors) {
            // errors?
            },
            creditsSuccess: function(data) {
                window.location = data;
            },
            canSendSuccess: function(data) {
                $.flirtplek.stopWaiting();
                if ( !data.can_send ) {
                    alert(data.message);
                }
            },
            changePreferencesSuccess: function(data) {
                $.flirtplek.stopWaiting();
                $('.btnpreference').removeAttr('disabled');
                $('.changevoorkeur_success').slideDown('fast');
            },
            changePreferencesError: function(data) {
                $.flirtplek.stopWaiting();
            },

            showNotification: function(data){
                if(data['show'] == "true") {
                    clearInterval($.flirtplek.profileVisitIntervalId);
                    $.flirtplek.profileVisitIntervalId = setInterval( "notificationInterval()",  $.flirtplek.defaultinterval );

                    $.slidePopup.CreateNotification(data,1000);

                    $.flirtplek.profileVisitTimerId = setTimeout(function(){
                        $('.notification_close').trigger('click');
                    }, (data['timeout'] * 1000));
                }

                if(data['time']) {
                    if (isNaN(data['time']) == false) {
                        clearInterval($.flirtplek.profileVisitIntervalId);
                        $.flirtplek.profileVisitIntervalId = setInterval( "notificationInterval()", (data['time'] * 1000) );
                    }
                }
            }
        }
    };

})(jQuery);
