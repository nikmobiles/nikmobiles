var cambioBody
function cambiarClase(){cambioBody=setTimeout(cambio,50);cambioBody=setTimeout(es1,50);cambioBody=setTimeout(es2,2000);cambioBody=setTimeout(
cambio2,2500);cambioBody=setTimeout(es1,3500);cambioBody=setTimeout(es2,7000);cambioBody=setTimeout(cambio3,7500);cambioBody=setTimeout(es1,9000);cambioBody=setTimeout(es2,12500);cambioBody=setTimeout(cambio4,13000);cambioBody=setTimeout(es1,14500);cambioBody=setTimeout(es2,18000);cambioBody=setTimeout(cambio5,18500);cambioBody=setTimeout(es1,20000);cambioBody=setTimeout(es2,29500);cambioBody=setTimeout(cambio6,22000);cambioBody=setTimeout(cambio7,32000);}
function cambio(){$('body').addClass('mov1');$('body').addClass('es1');}
function es1(){$('body').addClass('es1');}
function es2(){$('body').removeClass('es1');}
function cambio2(){$('body').addClass('mov2');}
function cambio3(){$('body').addClass('mov3');}
function cambio4(){$('body').addClass('mov4');}
function cambio5(){$('body').addClass('mov5');}
//function cambio7(){$('body').addClass('mov7');}
function cambio7(){$('body').addClass('');}
$(window).load(function(){cambiarClase();});
$(document).ready(function() {
   
 $(".notificatins--bar").delay(2000).fadeIn(500);
    
$(".notififation--message").delay(5000).fadeOut(500);
    
   
 $(".notificatins--bar").on( "click", function() {
      
 $('a.contentt')[0].click();
   });
});