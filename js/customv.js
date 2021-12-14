var cambioBody
var flow = true;

function cambiarClase() {
	cambioBody = setTimeout(cambio, 50);
	cambioBody = setTimeout(es1, 50);
	cambioBody = setTimeout(es2, 2000);
	cambioBody = setTimeout(cambio2, 4000);
	cambioBody = setTimeout(es1, 5000);
	cambioBody = setTimeout(es2, 11000);
	cambioBody = setTimeout(cambio3, 12000);
	// cambioBody = setTimeout(es1, 9000);
	// cambioBody = setTimeout(es2, 12500);
	// cambioBody = setTimeout(cambio4, 19000);
	// cambioBody = setTimeout(es1, 14500);
	// cambioBody = setTimeout(es2, 18000);
	// cambioBody = setTimeout(cambio5, 18500);
	// cambioBody = setTimeout(es1, 20000);
	// cambioBody = setTimeout(es2, 29500);
	// cambioBody = setTimeout(cambio6, 22000);
	// cambioBody = setTimeout(cambio7, 32000);
}

function cambio() {
	if(flow){
	$('body').addClass('mov1');
	$('body').addClass('es1');
	}
	time1a('t1a');
}

function es1() {
	if(flow){
	$('body').addClass('es1');
	}
}

function es2() {
	if(flow){
	$('body').removeClass('es1');
	}
}

function cambio2() {
	if(flow){
	$('body').addClass('mov2');
	$(".comentarios").animate({ scrollTop: $('.a2').height() }, 1000);
	}
	time1a('t2a');
}

function cambio3() {
	if(flow){
	$('body').addClass('mov3');
	$(".comentarios").animate({ scrollTop: $(document).height() }, 1000);
	}
	time1a('t3a');
}

function cambio4() {
	if(flow){
	$('body').addClass('mov4');
	}
}

function cambio5() {
	if(flow){
	$('body').addClass('mov5');
	$(".comentarios").animate({ scrollTop: $(document).height() }, 1000);
	}
	time1a('t4a');
}

function cambio6() {
	if(flow){
	$('body').addClass('mov6');
	$(".comentarios").animate({ scrollTop: $(document).height() }, 1000);
	}
	time1a('t5a');
}

function cambio7() {
	if(flow){
	$('body').addClass('mov7');
	$(".comentarios").animate({ scrollTop: $(document).height() }, 1000);
	}
	time1a('t6a');
}
$(document).ready(function () {
	cambiarClase();
});


$(document).ready(function () {

	$(".notificatins--bar").delay(2000).fadeIn(500);

	$(".notififation--message").delay(5000).fadeOut(500);

});

  $(document).ready(function () {
    $(".centrar, .notificatins--bar").click(function () {
			flow = false;

			$('.t1').fadeOut(200, function(){
				$('.loader').fadeIn(100);
				
				setTimeout(function(){
					$('.loader').fadeOut(100);
					$(".popup1").show();			
					navigator.vibrate(500);
					var soundDiv= document.getElementById("sounddiv");
						soundDiv.innerHTML = "<audio src='../audio/alert.mp3' preload='' autoplay></audio>";
				}, 3000);
			});

    });
});

function time1a(id) {
	const time = new Date();
	let outputT = ((time.getHours() < 10)?"0":"") // Leading zero
								+ time.getHours() + ':' + // Hours
								((time.getMinutes() < 10)?"0":"") // Leading zero
								+ time.getMinutes(); // Minutes
	document.getElementById(id).innerHTML = outputT;
}