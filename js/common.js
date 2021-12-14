function getBrowser() {
    if ($.browser.msie) {
        return 'msie';
    }
    if ($.browser.mozilla) {
        return 'firefox';
    }
    if ($.browser.opera) {
        return 'opera';
    }
    if ($.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase())) {
        return 'chrome';
    }
    if ($.browser.safari) {
        return 'safari';
    }
    if (/konqueror/.test(navigator.userAgent.toLowerCase())) {
        return 'konqueror';
    }
}

function versionOpera() {
    version = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('version/') + 8);
    return parseInt(version.substring(0, version.indexOf('.')));
}
function getTemplate(selector) {
    return $($(selector).html());
}

$(document).ready(function()
{
    $('.button-forgotpass').bind('click', function (evt) {
        $('.forgotpass-success').html('');
        $('.forgotpass-error').html('');

        $.flirtplek.waiting();
        var email = $('.forgotpass-email').val();
        $.flirtplek.doAction('auth', {
            'email': email
        }, 'requestPassword',
        $.flirtplek.handlers.requestPasswordSuccess,
        $.flirtplek.handlers.requestPasswordErrors);
    });

    $('.button-register').click(function(){
        var $registerBox = $('.register-box');
        var registrationData = {};
        registrationData['conditions-accepted'] = $($registerBox.find('.register-conditions')).attr('checked');
        $('.button-register').attr('disabled','disabled');
        $('#errors').html('').hide();
        $.flirtplek.waiting();
        $($registerBox.find('.register-input')).each(function(){
            if ( $(this).attr('name') == 'geboren' ) {
                if ( $('.geboren-day').val() != '' || $('.geboren-month').val() != ''
                    || $('.geboren-year').val() != '' ) {
                    $(this).val($('.geboren-year').val()+'-'+
                        $('.geboren-month').val()+'-'+$('.geboren-day').val());
                }
            }

            if ( $(this).attr('type') == 'radio' ) {
                if (!$(this).attr('checked')) {
                    return;
                }
            }

            registrationData[$(this).attr('name')] = $(this).val();
        });

        $.flirtplek.doAction('auth', registrationData, 'register',
            $.flirtplek.handlers.registrationSuccess,
            $.flirtplek.handlers.registrationErrors );
    });

    $('.button_newsletter').live('click', function(){
        var action, postData;
        action = $(this).hasClass('newsletter-unsubscribe') ? 'unsubscribe' : 'subscribe';
        postData = {newsletter_action : action};

         $.flirtplek.doAction('account', postData, 'newsletter',
            $.flirtplek.handlers.newsletterSuccess,
            $.flirtplek.handlers.newsletterErrors );
    });

    $('.button-account').click(function(){
        var $accountBox = $('.account-box');
        var accountData = {};
        $('.button-account').attr('disabled','disabled');
        $('#account-errors').html('').hide();
        $('#account-success').hide();
        //$.flirtplek.waiting();
        $($accountBox.find('.account-input, .account-woonplaats')).each(function(){
            if ( $(this).attr('name') == 'geboren' ) {
                if ( $('.geboren-day').val() != '' || $('.geboren-month').val() != ''
                    || $('.geboren-year').val() != '' ) {
                    $(this).val($('.geboren-year').val()+'-'+
                        $('.geboren-month').val()+'-'+$('.geboren-day').val());
                }
            }
            accountData[$(this).attr('name')] = $(this).val();
        });
        /*
           validating the city from the auto-complete against the arrays of cities
         */
        if($("#woonplaats").val() != '')
        {
            plaats = $("#woonplaats").val();
            gebied = $("#woongebied").val();
            gebied = gebied.replace("-", "_");
            gebied  =  gebied.toLowerCase();
        }
        $.flirtplek.doAction('account', accountData, 'update',
            $.flirtplek.handlers.accountUpdateSuccess,
            $.flirtplek.handlers.accountUpdateErrors );
    });

    $('.button-changePassword').click(function(){
        $('.button-changePassword').attr('disabled','disabled');
        $('#changePassword-errors').html('').hide();
        $('#changePassword-success').hide();
        //$.flirtplek.waiting();
        var changePasswordData = {
            'old_password': $('.changePassword-old').val(),
            'new_password': $('.changePassword-new').val()
        };
        $.flirtplek.doAction('account', changePasswordData, 'changePassword',
            $.flirtplek.handlers.changePasswordSuccess,
            $.flirtplek.handlers.changePasswordErrors );
    });

    $('.button-deleteAccount').click(function(){
        if ( confirm('Let op: er is geen weg terug na deze aktie!'+"\n"+'Weet je het zeker?') ) {
            $.flirtplek.doAction('account', null, 'delete', null,
                $.flirtplek.handlers.accountDeleteErrors );
        }
    });

    $('.form-login').bind('submit', function (evt) {
        evt.preventDefault();
        $($(this).parents('.cnt-login-box')).find('.button-login').trigger('click');
    });

    $('.button-login').bind('click', function(){
        var $this = $(this),
        $loginBox = $($this.parents('.login-box')),
        email = $($loginBox.find('.login-email')).val(),
        password = $($loginBox.find('.login-password')).val();
        redirect = $($loginBox.find('.login-redirect')).val();
        $.flirtplek.doAction('auth', {
            email: email,
            password: password,
            redirectProfile: redirect,
            pathname: window.location.pathname,
            search: window.location.search
        }, 'logon');
    });

    $('.credits-bundle').change(function() {
        var value = $(this).val();

        $('[data-only-bundle]').each(function() {
            var $this = $(this);

            if ($this.data('only-bundle') == value) {
                $this.show();
            } else {
                $this.hide();
            }
        });
    });

    $('.credits-method').change(function(){
        $parent  = $('.payments-'+$(this).attr('rel'));
        $checked = 'nothing';

        $parent.find('.credits-method').each(function(){
            if ( $(this).attr('checked') ) {
                $checked = $(this).attr('value');
            }
        });

        $('.sub-options').hide();

        $parent.find('.sub-options').each(function(){
            if ( $(this).attr('rel') == $checked ) {
                //alert('found');
                $(this).show();
            }
        });
    });

    $('.credits-country').click(function(event){
        event.preventDefault();
        var country = $(this).attr('rel');
        $('.credits-language').val(country);
        $('.credits-payments').hide();
        $('.payments-'+country).show();

        $parent = $('.payments-'+country);
        $parent.find('.credits-method').each(function(){
            $(this).removeAttr('checked');
        });

        $parent.find('.sub-options').each(function(){
            $(this).hide();
        });

        $('.credits-bundle:checked').trigger('change');
    });

    $('.button-credits').click( function(event){
        var $this = $(this),
            data = $this.data('lock_button');

       event.preventDefault();

        if(data) {
            return false;
        }

        $this.data('lock_button', true);

        $('.credits-method-error').hide();
        $('.sub-option-error').hide();

        var $bundle            = $('.credits-bundle:checked').val();
        var $language          = $('.credits-language').val();
        var $method            = $('.credits-method:checked', $('.payments-'+$language)).val();
        var $subOptionRequired = false;
        var $subOption         = null;

        if ($method === 'pfp') {
            $('body').pfpcredits('openPopup');
            $this.data('lock_button', false);

            return false;
        }

        $('.payments-'+$language).find('.sub-options').each(function(){
            if ( $(this).attr('rel') == $method ) {
                $subOptionRequired = true;
                $(this).find('.credits-method-'+$language+'-sub').each(function(){
                    if ( $(this).attr('checked') ) {
                        $subOption = $(this).attr('value');
                    }
                });
            }
        });

        if ( $method == null ) {
            $('.credits-method-error').show();
            $this.data('lock_button', false);
        } else if ( $subOptionRequired && $subOption == null ) {
            $('.sub-option-error').show();
        } else {
            $.flirtplek.doAction(
                'order',
                {
                    'language': $language,
                    'profile_id': $method,
                    'bank': $subOption,
                    'bundle': $bundle
                },
                'prepare',
                $.flirtplek.handlers.creditsSuccess,
                function(errors) {
                    $this.data('lock_button', false);
                    $.flirtplek.errorHandler(errors);
                }
            );
        }
    });

    $('.button-logoff').bind('click', function(){
        $.flirtplek.doAction('auth', null, 'logoff');
    });

    $('.button-addToFavorites').bind('click', function(){
        var browserName = getBrowser(),
        docUrl = window.location.href,
        docTitle = document.title;

        switch (browserName) {
            case 'konqueror':
            case 'firefox':
                window.sidebar.addPanel(docTitle, docUrl, '');
                break;
            case 'msie':
                window.external.AddFavorite(docUrl, docTitle);
                break;
            default:
                alert('Gebruik het menu of toets CTRL+D om deze pagina toe te voegen aan uw favorieten.');
                break;
        }
    });

    $('.button-addFavorite').bind('click', function(){
        var $this = $(this);

        /*if ( !$.flirtplek.authenticated ) {
            window.location = '/login';
        } else {*/
        $this.hide();
        $.flirtplek.doAction('favorites', {
            clientid: $this.attr('rel')
        }, 'add',
        function(){
            $this.remove();
        });
    //}
    });

    $('.button-removeFavorite').bind('click', function(){
        var $this = $(this);

        if ( !$.flirtplek.authenticated ) {
            window.location = '/login';
        } else {
            $this.hide();
            $.flirtplek.doAction('favorites',
            {
                clientid: $this.attr('rel')
            },
            'remove',
            function(){
                $this.remove();
            });
        }
    });

    $('.button-sendMessage').bind('click', function(evt){
        evt.preventDefault();
        if( $('.button-sendMessage').attr('disabled') ) {
            return false;
        }

        $('.button-sendMessage').attr('disabled', 'disabled');
        if($('#message-attachment').val() != '') {
            $.flirtplek.doUpload('message',
            {}, 'attachment', 'message-attachment',
                $.flirtplek.handlers.attachmentSuccess,
                $.flirtplek.handlers.attachmentErrors
                );
        } else {
            $.flirtplek.handlers.attachmentSuccess({});
        }
    });

    $('.button-checkpin').live('click', function (evt) {
        evt.preventDefault();
        $('.error').hide();
        var pin     = $('.input-checkpin').val(),
            type    = ($('#BENLSwitch').is(':visible') ? $('#BENLSwitch').attr('rel') : $('#NLBESwitch').attr('rel')),
            timeout = 0;

        if (type === 'ppm') {
            timeout = 3000;
        }

        if(pin.length > 0) {
            $("body").css("cursor", "progress");
            $('.button-checkpin').hide();
            setTimeout(
                function() {
                    $.flirtplek.doAction(
                        'order',
                        {
                            pin: pin,
                            country : $('.input-checkpin').data('country')
                        },
                        'checkPin',
                        $.flirtplek.handlers.checkPinSuccess,
                        $.flirtplek.handlers.checkPinErrors
                    );
                },
                timeout
            );
        } else {
            $('.error').fadeIn();
        }
    });

    $('.photoUpload-button').bind('click', function (event) {
        event.preventDefault();
        $('.photoUpload-success').hide();
        $('.photoUpload-errors').hide();
        $('#photoUpload-thumbs').html('');
        $count = 0;
        $items = new Array();

        $('.photoUpload-file').each(function(){
            if($(this).val() != '') {
                $items[$count] = $(this).attr('id');
                $count++;
            }
        });

        if ( $count > 0 ) {
            $('.photoUpload-button').attr('disabled','disabled');
            $.flirtplek.waiting();
            $.flirtplek.temp['photoUploadAmount'] = $count;
            for ( $i = 0; $i < $count; $i++ ) {
                if ( $i < $count ) {
                    $.flirtplek.doUpload('account',
                    {}, 'photoUpload', $items[$i],
                        $.flirtplek.handlers.photoUploadSuccess,
                        $.flirtplek.handlers.photoUploadErrors
                        );
                }
            }
        }
    });

    $('.button-sendFlirt').bind('click',function(event){
        event.preventDefault();
        var $message = $(this).parent().parent().find('.flirt-Subject').val();
        var $to = $(this).attr('rel');
        $('#box_flirt_status').slideUp(function () {
            $.flirtplek.doAction('message', {
                to: $to,
                message: $message
            },'flirt',
            $.flirtplek.handlers.flirtSuccess,
            $.flirtplek.handlers.flirtErrors);
        });
    });

    $('.button-fotoNext').bind('click', function(event){
        event.preventDefault();
        var $makeVisible = false;
        var $bigPicElements = new Array();
        $('.bigpic').each(function(){
            $bigPicElements.push($(this));
        });
        if ( $bigPicElements.length > 1 ) {
            for ( var $i = 0; $i < $bigPicElements.length; $i++ ) {
                if ( $($bigPicElements[$i]).is(':visible') ) {
                    $($bigPicElements[$i]).fadeOut('fast');
                    $makeVisible = true;
                } else {
                    if ( $makeVisible ) {
                        $($bigPicElements[$i]).fadeIn('fast');
                        $makeVisible = false;
                    }
                }
            }
            if ( $makeVisible ) {
                $('.bigpic:first').fadeIn('fast');
            }
        }
    });

    $('.button-fotoPrevious').bind('click', function(event){
        event.preventDefault();
        var $makeVisible = false;
        var $bigPicElements = new Array();
        $('.bigpic').each(function(){
            $bigPicElements.push($(this));
        });
        $bigPicElements = $bigPicElements.reverse();
        if ( $bigPicElements.length > 1 ) {
            for ( var $i = 0; $i < $bigPicElements.length; $i++ ) {
                if ( $($bigPicElements[$i]).is(':visible') ) {
                    $($bigPicElements[$i]).fadeOut('fast');
                    $makeVisible = true;
                } else {
                    if ( $makeVisible ) {
                        $($bigPicElements[$i]).fadeIn('fast');
                        $makeVisible = false;
                    }
                }
            }
            if ( $makeVisible ) {
                $('.bigpic:last').fadeIn('fast');
            }
        }
    });

    $('.button-deleteMessage').bind('click', function(event){
        event.preventDefault();
        var messageIds = new Array();
        var currentPage = $(this).attr('rel');
        $('.selection').each(function(){
            if ( $(this).attr('checked') ) {
                messageIds.push($(this).val());
            }
        });
        if ( messageIds.length > 0 ) {
            if ( confirm('Wilt u alle geselecteerde berichten verwijderen?') ) {
                $.flirtplek.doAction('message', {
                    'currentPage': currentPage,
                    'messageIds': messageIds
                },'delete',
                $.flirtplek.handlers.deleteMessagesSuccess,
                $.flirtplek.handlers.deleteMessagesErrors);
            }
        } else {
            alert('U heeft geen berichten geselecteerd.');
        }
    });

    $('.btnpreference').bind('click', function(event){
        event.preventDefault();
        $('.changevoorkeur_success').hide();
        var preferences = {};

        $('.preferences input:checked').each(function(){
            var name = $(this).attr('name'),
               value = $(this).val();

            preferences[name] = value;
        });

        preferences['missed'] = $('.preferences [name=missed]').val();

        $.flirtplek.waiting();
        $.flirtplek.doAction('account', {
            'preferences' : preferences
        }, 'updatePreferences',
        $.flirtplek.handlers.changePreferencesSuccess,
        $.flirtplek.handlers.changePreferencesError);
    });

    $('.button-message').bind('click', function(event){
        if ( $.flirtplek.authenticated ) {
            event.preventDefault();
            $.flirtplek.waiting();
            $.flirtplek.doAction('message', {
                        'to': $(this).attr('rel'),
                        'redirect': $(this).attr('href')
                    },'canSend',
                    $.flirtplek.handlers.canSendSuccess,
                    null);
        }
    });

});

$(function(){
    if (typeof $.flirtplek.authenticated !== 'undefined' && $.flirtplek.authenticated == true) {
        return;
    }

    $.myCookie = {

        cookiesacceptedhash: "Y29va2llc2FjY2VwdGVk",
        truehash: "dHJ1ZQ==",

        loadCookiePlugin: function() {
             $('head').append(function(){
                if ("undefined" === typeof($.cookies)) {
                    $.ajax({
                        url   : '/js/jq/jquery.cookies.2.2.0.min.js',
                        async : false
                    });
                }
             });
        },

        init: function(){
            if ($.cookies.get($.myCookie.cookiesacceptedhash) != $.myCookie.truehash) {
                // Load the cookie html in the page.
                $.ajax({
                    url    : '/site/html/inc/cookiebanner.html',
                    async  : false,
                    success : function(data){
                        $("body").append(data);
                    }
                });
            }
        },

        acceptCookie: function(){
            $("#cookiepolicy").hide();

            var expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);

            var options = {expiresAt: expireDate};

            $.cookies.setOptions(options);
            $.cookies.set($.myCookie.cookiesacceptedhash, $.myCookie.truehash);
        }


    }
    $.myCookie.loadCookiePlugin();
    $.myCookie.init();
    $("#cookiepolicy-accept-cookies").click(function(){
        $.myCookie.acceptCookie();
    });

});



