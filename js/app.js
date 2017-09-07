//Definir variables globales
    var reiniciar = false; //Iniciar el tablero
    var gameOver = false; //Verificar que el juego ha terminado
    var dragStatus = false; //No permitir realizar movimientos
    var columnaActual = "";
    var col = "";
    var numColumnas = 7; //Definir numero de columnas del tablero
    var numFila = 7; //Definir numero de filas del tablero
    var numDulces = 4 //Definir cantidad de dulces
    var gridFila = [];
    var gridCol =[]
    var mins = 2;  //Set the number of minutes you need
    var secs = mins * 60; //Convertir los minutos a segundos
    var currentSeconds = 0; //Definir segundos iniciales del juego
    var currentMinutes = 0; //Definir minutos iniciales del juego
    var interval = 1000; //Intervalo de tiempo (1s) para repetir la funcion del cronometro en cuenta regresiva
    var desplazamientoHorizontal = 117; //Cantidad de pixeles definidos para realizar el movimiento Vertical
    var desplazamientoVertical = 96; //Cantidad de pixeles definidos para realizar el movimiento Vertical
    var desplazamiento= ""; //Direccion del desplazamiento
    var posTop = 0;  //Posiciones superior inicial del elemento
    var posLeft = 0; //Posiciones lateral inicial del elemento
    var elementoActual = ""
    var elementoSustituir = ""

$(function(){

  //Iniciar funcion de cambio de color. Repetirla cada 1.5segundos
  deshabilitarMovimientos() //No permitir realizar movimientos
  setInterval(titleColor, 1500); //Iniciar funcion cambio de color de titulo y repetirlacada 1.5 segundos
  iniciarTablero(); //Generar nueva partida

  $('.btn-reinicio').on('click',function(){
    if($(this).html() == "Iniciar" && gameOver == false){
      dragStatus = false;
      alert(dragStatus)
      iniciarCronometro(interval); 
      $(this).html("Reiniciar");
      reiniciar = true
      habilitarMovimientos() 
    }else if( $(this).html() == "Reiniciar" && gameOver == false){
      //$(this).html("Iniciar");
      mins = 2;
      secs = mins * 60; 
      currentSeconds = 0;
      currentMinutes = 0;
      reiniciar = false;
      dragStatus = false;
      reiniciarJuego()
    }
  })

  /*Definir las propiedades iniciales de arrastre de elementos*/
$( ".elemento" ).draggable({ //Permitir arrastrar elementos del DOM que contengan la clase "elemento"
    zIndex: "100", //Colocar el elemento seleccionado por encima de los demas
    drag: function(e){
      elementoActual = $(this);
      console.log(dragStatus);
      //console.log(elementoActual);
      /*columnaActual = $(this).parent()[0].getAttribute("class");
      poscolumnaActual = $(this).parent()[0].getAttribute("class").substr(4,4); //Seleccionar el elemento padre y seleccionar la columna a la cual pertenece el elemento
      columnaAnterior = (Number(poscolumnaActual) -1)
      columnaSiguiente = (Number(poscolumnaActual) + 1)*/
       elementoActual.addClass("moved-1");
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
      posTop = elementoActual.css("top") //Obtener la posicion vertical en la que se suelta el elemento
      posLeft = elementoActual.css("left") //Obtener la posicion horizontal en la que se suelta el elemento
      elementoActual.css({zIndex: ""}) //Reiniciar la propiedad de profundidad del elemento
      elementoSustituir = $(this)
      elementoSustituir.addClass("moved-2")
      console.log("Actual: "+elementoActual + " Sustituir:" + elementoSustituir)
      validarMovimiento(posTop, posLeft, elementoActual,elementoSustituir) //Validar el movimiento
      //console.log(elementoActual);
      //console.log($(this));
       //console.log('PosX0:' + posX0 + ' posX1: '+posX1+ ' posY0:' +posY0+ ' posY1:'+posY1);
    }, accept: ".elemento"  // permitir solo soltar el elemento en la columna anterior, actual o siguiente del elemento actual
  });
});

function titleColor(){
  $('.main-titulo').toggleClass('main-titulo-inverse')
}

function deshabilitarMovimientos(){
  $(".elemento").draggable({disabled: true})
}

function habilitarMovimientos(){
  $(".elemento").draggable({disabled: false})
}


function reiniciarJuego(){
  mins = 2;
  secs = mins * 60; 
  currentSeconds = 0;
  currentMinutes = 0;
  reiniciar = false;
  vaciarTablero();
  iniciarTablero(); //Generar nuevo juego
}

 function iniciarCronometro(interval) {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        if(currentSeconds <= 9) currentSeconds = "0" + currentSeconds;
        secs--;
          $('#timer').html("0"+currentMinutes + ":" + currentSeconds)
          //console.log("tres");
        /*document.getElementById("timerText").innerHTML = currentMinutes + ":" + currentSeconds; //Set the element id you need the time put into.*/
        if(secs !== -1) setTimeout('iniciarCronometro('+interval+')',interval);
}


/*Iniciar tablero*/
function iniciarTablero(){
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

function validarMovimiento(top,left,elementoActual, elementoSustituir){
  desplazamiento = "";
  var horizontal = false;
  var vertical = false;

  if((left == "117px" || left == "-117px") && (top == "0px")) {//Validar movimientos laterales Limitando movimiento diagonal
    if(left == "117px"){
      desplazamiento = "Derecha"
    }else{
      desplazamiento = "Izquierda"
    }

    horizontal = true;
    console.log("Movimiento Horizontal Valido. Desplanzando hacia la " +desplazamiento)   


  }else  if((top == "96px" || top == "-96px")  && (left == "0px")){//Validar Movimientos Verticales Limitando movimiento diagonal
    if(top == "-96px"){
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
    desplazarElemento(elementoActual, elementoSustituir, desplazamiento)
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
    //console.log("Espacio ocupado: "+ espacioOcupado);
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
  var elemento1 = $('.col-1 img')[0].getAttribute('src')
  //var anterior = elemento1.previousSibling().getAttribute('src')
  var siguiente = elemento1.nextSibling().getAttribute('src')
  //console.log(elemento1);
}

function imagenAleatoria(){
  img = Math.floor(Math.random() * numDulces)+1 //Obtener ina imagen aleatoria
  return img;
}


function desplazarElemento(elementoActual, elementoSustituir, desplazamiento){
  console.log("elementoActual: "+elementoActual+ " " +"elementoSustituir: "+ elementoSustituir + "Desplazamiento: "+desplazamiento)
  var elmentosDesplazados = new Array()
  var i = 0;

  //console.log($('move-1').nextSibling)
  value = $('.moved-1').attr('src')
  //elemento1 = $('.moved-1')[0].nextSibling

  //console.log($(elementoActual));
  //console.log($(elementoSustituir));

  imagenActual = $(elementoActual).attr('src')
  idActual = $(elementoActual).attr('id')

  imagenSustituir = $(elementoSustituir).attr('src')
  idSustituir = $(elementoSustituir).attr('id')

  //console.log(imagenSustituir);
  //console.log(idSustituir);

  //console.log(imagenActual);
  //console.log(idActual);
  elementoSustituir.animate({
    /*left: "-=120"*/
  }, 750, function(){

    
    if(desplazamiento == "Derecha"){ //Mover Derecha
      //console.log("moviendo a la derecha");
      $(elementoSustituir).animate({
        left: "-=117"
      }),750
    }
    if(desplazamiento == "Izquierda"){ //Mover Izquierda
      //console.log("moviendo a la izquierda");
      $(elementoSustituir).animate({
        left: "+=117"
      }),750
    }

    if(desplazamiento == "Arriba"){ //Mover Arriba
      //console.log("moviendo a Arriba");
      $(elementoSustituir).animate({
        top: "+=96"
      }),750
    }
    if(desplazamiento == "Abajo" ){ //Mover Abajo
      //console.log("moviendo a Abajo");
      $(elementoSustituir).animate({
        top: "-=96"
      }),750
    }

    //console.log(direccion);
    //$(elementoSustituir).detach()
    //$(elementoSustituir).clone().insertBefore("#"+idSustituir)
    setInterval(sustituirElemento, 750)
    function sustituirElemento(){
      //$(elementoSustituir).attr({id:idActual, src : imagenActual}).css({top:"0", left:"0", right:"0", bottom: "0"})
      $(elementoActual).attr({id : idSustituir, src : imagenSustituir}).css({top:"0", left:"0", right:"0", bottom: "0"})
      elementoSustituir = ""
      elementoActual = ""
    }

    columnaActual = $(this).parent()[0].getAttribute("class");
    poscolumnaActual = $(this).parent()[0].getAttribute("class").substr(4,4); //Seleccionar el elemento padre y seleccionar la columna a la cual pertenece el elemento
    columnaAnterior = (poscolumnaActual -1)
    columnaSiguiente = (1+Number(poscolumnaActual))
    console.log('col-'+columnaAnterior+ ' col-'+poscolumnaActual + 'col-'+columnaSiguiente);
    //$(elementoSustituir).insertBefore("#"+idActual)
    console.log("E");
  }
)
}
