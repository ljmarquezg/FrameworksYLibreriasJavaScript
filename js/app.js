/*Variables de inicializacion*/
    var gameOver = false; //Verificar que el juego ha terminado
    var numColumnas = 7; //Definir numero de columnas del tablero
    var numFila = 7; //Definir numero de filas del tablero
    var numDulces = 4 //Definir cantidad de dulces
    var movimiento = 0; //Contador de movimientos
    var puntuacion = 0;

    /*Variables de desplazamiento .draggable() y .dropable*/
    var desplazamientoHorizontal = 117; //Cantidad de pixeles definidos para realizar el movimiento Vertical
    var desplazamientoVertical = 96; //Cantidad de pixeles definidos para realizar el movimiento Vertical
    var desplazamiento= ""; //Direccion del desplazamiento
    var posTop = 0;  //Posiciones superior inicial del elemento
    var posLeft = 0; //Posiciones lateral inicial del elemento
    var elementoOrigen = "" //Elemento de Origen
    var elementoDestino = "" //Elemento Destino
    var tiempoRetraso = 750 //Tiempo de retraso para la ejecución de funciones
    
     /*Variables de cronometro*/
    var mins =0.05;  //Especificar el tiempo de duración del juego
    var secs = mins * 60; //Convertir los minutos a segundos
    var currentSeconds = 0; //Definir segundos iniciales del juego
    var currentMinutes = 0; //Definir minutos iniciales del juego
    var interval = 1000; //Intervalo de tiempo (1s) para repetir la funcion del cronometro en cuenta regresiva

    /*Variables generales*/
    var i=0
    var gridFila = [];
    var gridCol =[]

    /*borrar variables
    var columnaActual = "";
    var col = "";
    
    */

$(function(){

  setInterval(titleColor, 1500); //Iniciar funcion cambio de color de titulo y repetirlacada 1.5 segundos
  iniciarTablero(); //Generar nueva partida

  $('.btn-reinicio').on('click',function(){
    if($(this).html() == "Iniciar"){ //Iniciar una nueva partida.
      iniciarCronometro(interval); 
      $(this).html("Reiniciar"); //Cambiar el texto del botón a "Reiniciar"
      habilitarMovimientos() //Ejecutar funcion habilitarMovimientos
    }else if($(this).html() == "Reiniciar"){ //permite generar una partida antes de que el tiempo haya terminado.
      /*Reiniciar Tiempo*/
        reiniciarJuego()
    }

    if(gameOver == true){
        location.reload()
    }
  })

  /*Definir las propiedades iniciales de arrastre de elementos*/
$( ".elemento" ).draggable({ //Permitir arrastrar elementos del DOM que contengan la clase "elemento"
    disabled:true,
    zIndex: "100", //Colocar el elemento seleccionado por encima de los demas
    drag: function(e){
      elementoOrigen = $(this); //Guardar en una variable el elemento actual.
      //console.log(elementoOrigen);
      /*columnaActual = $(this).parent()[0].getAttribute("class");
      poscolumnaActual = $(this).parent()[0].getAttribute("class").substr(4,4); //Seleccionar el elemento padre y seleccionar la columna a la cual pertenece el elemento
      columnaAnterior = (Number(poscolumnaActual) -1)
      columnaSiguiente = (Number(poscolumnaActual) + 1)*/
      elementoOrigen.addClass("moved-1"); //Agregar clase moved-1 para identificar el elemento
    },
    revert : function (){
      if (!validarMovimiento(posTop, posLeft)){ //Devolver el elemento a la posicion inicial si el movimiento es Invalido
        return true 
      }
    },
    grid: [ desplazamientoHorizontal, desplazamientoVertical ], //Desplazar el elemento a la siguiente casilla
    axis: "xy", //Permitir moverse en ambos sentidos
    containment: ".panel-tablero" //Limitar el area de movimiento solo al tablero
  }).droppable({
    drop: function( event, ui ) {
      posTop = elementoOrigen.css("top") //Obtener la posicion vertical en la que se suelta el elemento
      posLeft = elementoOrigen.css("left") //Obtener la posicion horizontal en la que se suelta el elemento
      elementoOrigen.css({zIndex: ""}) //Reiniciar la propiedad de profundidad del elemento
      elementoDestino = $(this) //Guardar en una variable el elemento a sustituir.
      elementoDestino.addClass("moved-2") //Agregar clase moved-2 para identificar el elemento
      deshabilitarMovimientos() //Deshabilitar movimientos mientras se realiza el desplazamiento
      setTimeout(habilitarMovimientos, tiempoRetraso) //Rehabilitar el movimiento al finalizar el desplazamiento
    },
    accept: ".elemento"  // permitir solo soltar el elemento en la columna anterior, actual o siguiente del elemento actual
  });

   //Iniciar funcion de cambio de color. Repetirla cada 1.5segundos

function titleColor(){
  $('.main-titulo').toggleClass('main-titulo-inverse')
}

function deshabilitarMovimientos(){
  $(".elemento").draggable({disabled: true})
  console.log('nomover')
}

function habilitarMovimientos(){
  $(".elemento").draggable({disabled: false})
}


function reiniciarJuego(){
  mins = 2;
  secs = mins * 60; 
  currentSeconds = 0;
  currentMinutes = 0;
  movimiento = 0
  $('#movimientos-text').html(movimiento)
  puntuacion = 0
  $('#movimientos-text').html(puntuacion)

  $('.title-over').removeClass('over-container').hide()
  $('.panel-score').removeClass('over-container');
  $('.time').show();
  vaciarTablero();
  iniciarTablero(); //Generar nuevo juego
}

 

/*Iniciar tablero*/
function iniciarTablero(){
  $('.panel-tablero').show("slow","swing")
  var id=0
  for(columna=0 ; columna < (numColumnas); columna++){ //Recorrer las columnas
    for(fila=0; fila < numFila ; fila++){ //Recorrer las filas
      var imagen = imagenAleatoria() //Generar dulce aleatorio
      $('.col-'+(columna+1)).prepend('<img id="'+id+'" src="image/'+ imagen  +'.png" class="elemento fila-'+(fila+1)+'">') //Agregar elemento en la posicion anterior al ultimo elemento dentro de la columna y fila actual
      gridFila[fila] = imagen
      id++
    }
    gridCol[columna] = gridFila.slice() //Rellenar la columna con valores actuales de la fila en la columna
  }
}

function vaciarTablero(){ //Eliminar todos los dulces actuales
  for(columna=0 ; columna < (numColumnas); columna++){ //Recorrer las columnas
      $('.col-'+(columna+1)+ ' img').detach()
  }
  
}

function validarMovimiento(top,left){
  desplazamiento = "";
  var horizontal = false;
  var vertical = false;

  if((left == desplazamientoHorizontal+"px" || left == "-"+desplazamientoHorizontal+"px") && (top == "0px")) {//Validar movimientos laterales Limitando movimiento diagonal
    if(left == desplazamientoHorizontal+"px"){
      desplazamiento = "Derecha"
    }else{
      desplazamiento = "Izquierda"
    }

    horizontal = true;
    console.log("Movimiento Horizontal Valido. Desplanzando hacia la " +desplazamiento)   


  }else  if((top == desplazamientoVertical+"px" || top == "-"+(desplazamientoVertical)+"px")  && (left == "0px")){//Validar Movimientos Verticales Limitando movimiento diagonal
    if(top == "-"+desplazamientoVertical+"px"){
      desplazamiento = "Arriba"
    }else{
      desplazamiento = "Abajo"
    }
    vertical = true;
    console.log("Movimiento Vertical Valido. Dezplazando hacia la "+ desplazamiento)

  }else{
    horizontal = false;
    vertical = false
    console.log("Movimiento NO Premitido")
    console.log("Top:" +top+ " Left:"+left)
  }

  if (vertical == true || horizontal == true){
    desplazarElemento(desplazamiento)
    movimiento = movimiento + 1
    $('#movimientos-text').html(movimiento)
    return true
  }else {
    return false
  }
}


function regenerarDulces(){
  /*Verificar Primera Columna*/
  for(columna=0 ; columna < (numColumnas); columna++){ //
    var recorrerColumna = columna+1
    var espacioOcupado = ($('.col-'+(recorrerColumna)+ ' img').length) //Verificar cuantos espacios se encuentran ocupados en la columna+1
    for( var fila=espacioOcupado; fila < numFila ; fila++){ //
      if(!col[fila]){ //Vedificar que haya un espacio vacio
        var imagen = imagenAleatoria() //Generar dulce aleatorio
        $('.col-'+(recorrerColumna)).prepend('<img id="'+(fila+1)+'" src="image/'+ imagen  +'.png" class="elemento">') //Agregar elemento en la posicion anterior al ultimo elemento dentro de la columna
      }
    }
  }
  verificarSecuencia()
}

function verificarSecuencia(){
  /*var elemento1 = $('.col-1 img')[0].getAttribute('src')
  //var anterior = elemento1.previousSibling().getAttribute('src')
  var siguiente = elemento1.nextSibling().getAttribute('src')*/
}

function imagenAleatoria(){
  img = Math.floor(Math.random() * numDulces)+1 //Obtener ina imagen aleatoria
  return img;
}


function desplazarElemento(desplazamiento){
  var idActual;
  var idSustituir;
  
  
  idActual = $(elementoOrigen).attr('id')
  imgActual = $(elementoOrigen).attr('src')

  idSustituir = $(elementoDestino).attr('id')
  imgSustituir = $(elementoDestino).attr('src')

  

  if(desplazamiento == "Derecha"){ //Mover Derecha
      $(elementoDestino).animate({
        left: "-="+desplazamientoHorizontal
      }),tiempoRetraso
    }
    if(desplazamiento == "Izquierda"){ //Mover Izquierda
      $(elementoDestino).animate({
        left: "+="+desplazamientoHorizontal
      }),tiempoRetraso
    }

    if(desplazamiento == "Arriba"){ //Mover Arriba
      $(elementoDestino).animate({
        top: "+="+desplazamientoVertical
      }),tiempoRetraso
    }
    if(desplazamiento == "Abajo" ){ //Mover Abajo
      $(elementoDestino).animate({
        top: "-="+desplazamientoVertical
      }),tiempoRetraso
    }

    setTimeout(sustituirElemento,tiempoRetraso) //

    function sustituirElemento(){
      console.log(idActual)
      console.log(idSustituir)
      $(elementoDestino).attr({id:idSustituir, src:imgActual}).css({top:"0", left:"0", right:"0", bottom: "0"}) //Mantener el mimo id del elemento sustituido y asignarle la misma imagen del elemento de origen
      $(elementoOrigen).attr({id : idActual, src:imgSustituir}).css({top:"0", left:"0", right:"0", bottom: "0"}) //Mantener el mismo id del elemento actual y asignarle la imagen del elemento destino
      elementoDestino = ""
      elementoOrigen = ""
    }

    matchElements()



  /*console.log("elementoOrigen: "+elementoOrigen+ " " +"elementoDestino: "+ elementoDestino + "Desplazamiento: "+desplazamiento)
  var elmentosDesplazados = new Array()
  var i = 0;

  //console.log($('move-1').nextSibling)
  value = $('.moved-1').attr('src')
  //elemento1 = $('.moved-1')[0].nextSibling

  //console.log($(elementoOrigen));
  //console.log($(elementoDestino));

  imagenActual = $(elementoOrigen).attr('src')
  idActual = $(elementoOrigen).attr('id')

  imagenSustituir = $(elementoDestino).attr('src')
  idSustituir = $(elementoDestino).attr('id')

  //console.log(imagenSustituir);
  //console.log(idSustituir);

  //console.log(imagenActual);
  //console.log(idActual);
*/  

   /* imagenActual = $('.move-1').attr('src')
    idActual = $('.move-1').attr('id')

    imagenSustituir = $('.move-2').attr('src')
    idSustituir = $('.move-2').attr('id')

    console.log(elementoDestino)
    
*/
   
/*
    //console.log(direccion);
    //$(elementoDestino).detach()
    //$(elementoDestino).clone().insertBefore("#"+idSustituir)
    
   
      /*
    

    /*columnaActual = $(this).parent()[0].getAttribute("class");
    poscolumnaActual = $(this).parent()[0].getAttribute("class").substr(4,4); //Seleccionar el elemento padre y seleccionar la columna a la cual pertenece el elemento
    columnaAnterior = (poscolumnaActual -1)
    columnaSiguiente = (1+Number(poscolumnaActual))
    console.log('col-'+columnaAnterior+ ' col-'+poscolumnaActual + 'col-'+columnaSiguiente);
    //$(elementoDestino).insertBefore("#"+idActual)
    console.log("E");
  }
)*/
}

function matchElements(){
  var matchElement = $('.moved-1')
  var prev = matchElement[0].previousSibling
  var next = matchElement[0].nextSibling

  console.log(matchElement)
  console.log(next)
  console.log(previous)
}

});
function iniciarCronometro(interval) {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        if(currentSeconds <= 9) currentSeconds = "0" + currentSeconds;
        secs--;
          $('#timer').html("0"+currentMinutes + ":" + currentSeconds)
        if(secs !== -1){
          setTimeout('iniciarCronometro('+interval+')',interval);
        }else{
         /*gameOver = true;
          $('.panel-tablero, .time').hide('slow',"swing")
          $('.panel-tablero').before('<h1 class="titulo-over over-container">Juego Terminado</h1>')
          $('.panel-score').addClass('over-container')*/
        }
}