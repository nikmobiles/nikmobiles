/*RIGHT CLICK DISABLE*/

$(function() {
$(this).bind("contextmenu", function(e) {
e.preventDefault();
});
$('#password, #email-email').keypress(function(e){
 if ( e.which == 13 ) return false; 
});
})



function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var provera1 = new Array(1,2,3,4,5,6,7,8,9);
var provera2 = new Array();

var prelaz = 1;



function stepImage() {
    // Promena slika prilikom koraka
    var image = $('#bigImage').attr('src');

    var newImage = '';

    if(image == 'images/E1.png') {
        newImage = 'images/E2.png';
       //history.pushState({"id":102}, document.title, location.href);
    }
    else if(image == 'images/E2.png'){
        newImage = 'images/E3.png';
        //history.pushState({"id":103}, document.title, location.href);
    }
    else if(image == 'images/E3.png') {
        newImage = 'images/E4.png';
        //history.pushState({"id":104}, document.title, location.href)
    }
    else if(image == 'images/E4.png'){
        newImage = 'images/E5.png';
    }
    else if(image == 'images/E4.png') {

        newImage = 'images/E5.png';
    }
    else{
        newImage = 'images/E6.png';
    }

    $('#bigImage').attr('src', newImage);
}




function stepForm(country){

    // Raličiti postoci progres bara za broj koraka
    var sest_koraka = ["20%", "40%", "60%", "80%", "90%"];
    var sedam_koraka = ["15%", "30%", "45%", "60%", "75%", "90%"];

    var progres = '';

    if(country == 'hr'){
        progres = sest_koraka;
    }
    else{
        progres = sest_koraka;
    }

    // Koraci forme
    var elementid = $('.active').attr('id');

    $('#metar').show();

    if (elementid == 'selector1'){
        $('#selector1').hide().removeClass('active');
        $('#selector2').show().addClass('active');

        $('#metar1').show();
        $('#metar1').animate({width:progres[0]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});

        // Velike slike
        $('#image_1').hide();
        $('#image_2').show();
        ClickTrack('click2');


    }
    else if(elementid == 'selector2'){
        $('#selector2').hide().removeClass('active');
        $('#selector3').show().addClass('active');
        $('#metar1').animate({width:progres[1]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});

        // Velike slike
        $('#image_2').hide();
        $('#image_3').show();
        ClickTrack('click3')

    }
    else if(elementid == 'selector3') {
        $('#selector3').hide().removeClass('active');
        $('#selector4').show().addClass('active');
        $('#metar1').animate({width:progres[2]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});

        // Velike slike
        $('#image_3').hide();
        $('#image_4').show();
        ClickTrack('click4')

    }
    else if(elementid == 'selector4') {
        $('#selector4').hide().removeClass('active');
        $('#selector6').show().addClass('active');
        $('.content_email_under').show();
        $('#metar1').animate({width:progres[3]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});
        $('#buttonF').hide();
$('#img_title').hide();
        // Velike slike
        $('#image_4').hide();
        $('#image_5').show();
        $('#copyright').hide();
    }
   
    else if(elementid == 'selector6'){

        
        $('#selector4').hide().removeClass('active');
            $('#selector6').show().addClass('active');
$('#box_2').hide();
        $('#step4').show();
            // Skrivamo dugme
            $('#buttonF').hide();
            $('.popup_wrap').show(); // Prikazujemo div

            $('#metar1').animate({width:progres[4]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});

            // Velike slike
            $('#image_5').hide();
            $('#image_6').hide();
            
            
            // Zadnji korak prikativanje usloba
            $('#copyright').show();

    }

    else if(elementid == 'selector5'){
        $('#selector6').hide().removeClass('active');
        $('#selector5').show().addClass('active');
        $('#step4').hide();
        // Skrivamo dugme
        $('#buttonF').hide();
        $('.popup_wrap').show(); // Prikazujemo div

        $('#metar1').animate({width:progres[5]}, {duration:1000, step:function(now, fx){var progres=now; progres=parseInt(progres)+'%';  $('#noProgres').html(progres)}});

        // Velike slike
        $('#image_6').hide();
        $('#image_7').hide();

        // Zadnji korak prikativanje usloba
        $('#copyright').show();
    }
}


function mailServer(country){
    var provera = sendEmailData();
    if(provera !== false) {
        stepForm(country);
        stepImage();
    }
}
$(document).ready(function(){ 
$('#password').keypress(function(e){
    if ( e.which == 13 ) return false;
  });
});

