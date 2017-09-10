/*Variables de inicializacion*/
    var reiniciar = 0 // Iniciar la variable de reinicio
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
    var tiempoRetraso = 1000 //Tiempo de retraso para la ejecución de funciones
    
     /*Variables de cronometro*/
    var mins =2;  //Especificar el tiempo de duración del juego
    var secs = mins * 60; //Convertir los minutos a segundos
    var currentSeconds = 0; //Definir segundos iniciales del juego
    var currentMinutes = 0; //Definir minutos iniciales del juego
    var interval = 1000; //Intervalo de tiempo (1s) para repetir la funcion del cronometro en cuenta regresiva

    /*Variables generales*/
    var contadorEfecto = 0; //Inicializar el contador de efecto
    var totalContadorEfecto = 6; //Definir cuantas veces se repetirá el efecto de elementos consecutivos
    var matchDulcesConsecutivos = [] //Matríz para guardar los elementos consecutivos
    var tiempoEfecto = (tiempoRetraso/2) //Definir el tiempo de repetición del efecto de elementos consecutivos
    var valorDulce = 10 //Definir el valor de los dulces

    /*Extra*/
    habilitarMensajes = false; //Mostrar mensajes de puntuación

$(function(){
  $( document ).tooltip(); //Habilitar tooltip
  /*** Iniciar funcion cambio de color de titulo y repetirlacada 1 segundo ***/
  setInterval(colorTitulo, interval);

  /*** Generar nueva partida ***/
  iniciarTablero(); 

  $('.icon').on('click', function (){
    if(habilitarMensajes == false){
      $(this).removeClass('fi-comment-minus').addClass('fi-comment-quotes').attr('title',"Deshabilitar mensajes de puntuación")
      habilitarMensajes = true
  }else{
      $(this).addClass('fi-comment-minus').removeClass('fi-comment-quotes').attr('title',"Habilitar mensajes de puntuación")
      $('#mensaje').hide()
      habilitarMensajes = false
  }

  })

  $('.btn-reinicio').on('click',function(){
    if(reiniciar == 0){ //Iniciar una nueva partida.
      iniciarCronometro(interval);
      matchElements();
      $(this).html("Reiniciar"); //Cambiar el texto del botón a "Reiniciar"
      reiniciar++
    }else{ //permite generar una partida antes de que el tiempo haya terminado.
        location.reload()
    }
  })

/*** Iniciar funcion de cambio de color ***/
  function colorTitulo(){
    $('.main-titulo').toggleClass('main-titulo-inverse')
  }
/*** Función para deshabilitar movimientos ***/
  function deshabilitarMovimientos(){
    console.log("Operación en curso. Movimiento Deshabilitado")
    $(".elemento").draggable({disabled: true}) //Deshabilitar mover dulces
  }

/*** Función para Habilitar movimientos ***/
  function habilitarMovimientos(){
    console.log("Movimiento Habilitado")
    $( ".elemento" ).draggable({ //Permitir arrastrar elementos del DOM que contengan la clase "elemento"
      disabled:false,
      zIndex: "100", //Colocar el elemento seleccionado por encima de los demas
      drag: function(e){
        elementoOrigen = $(this); //Guardar en una variable el elemento actual.
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
        deshabilitarMovimientos() //Deshabilitar movimientos mientras se realiza el desplazamiento
        setTimeout(habilitarMovimientos, tiempoRetraso) //Rehabilitar el movimiento al finalizar el desplazamiento
      },
      accept: ".elemento" //aceptar solo elementos col la clase "elemento"
    });
  }

  /*Iniciar tablero*/
  function iniciarTablero(){
    $('.panel-tablero').show("slow","swing")
    for(var columna=0 ; columna < (numColumnas); columna++){ //Recorrer las columnas
      for(var fila=0; fila < numFila ; fila++){ //Recorrer las filas
        var imagen = imagenAleatoria() //Generar dulce aleatorio
        $('.col-'+(columna+1)).prepend('<img src="image/'+ imagen  +'.png" class="elemento">') //Agregar elemento en la posicion anterior al ultimo elemento dentro de la columna y fila actual
      }
    }
  }

  function validarMovimiento(top,left){
    desplazamiento = "";
    var horizontal = false; //Iniciar evento horizontal
    var vertical = false; //Iniciar evento vertical

    if((left == desplazamientoHorizontal+"px" || left == "-"+desplazamientoHorizontal+"px") && (top == "0px")) {//Validar movimientos laterales Limitando movimiento diagonal
      if(left == desplazamientoHorizontal+"px"){
        desplazamiento = "Derecha"
      }else{
        desplazamiento = "Izquierda"
      }
      horizontal = true;
      console.log("Desplanzando hacia la " +desplazamiento)   
    }else  if((top == desplazamientoVertical+"px" || top == "-"+(desplazamientoVertical)+"px")  && (left == "0px")){//Validar Movimientos Verticales Limitando movimiento diagonal
      if(top == "-"+desplazamientoVertical+"px"){
        desplazamiento = "Arriba"
      }else{
        desplazamiento = "Abajo"
      }
      vertical = true;
      console.log("Dezplazando hacia la "+ desplazamiento)
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
    /*** Generar nuevos dulces***/
    for(var columna=0 ; columna < numColumnas; columna++){ //Recorrer Columnas
      var recorrerColumna = columna+1
      var espacioOcupado = ($('.col-'+(recorrerColumna)+ ' img').length) //verificar la cantidad de imagenes -dulces- dentro de la columna
      if(espacioOcupado < numColumnas){ //Verificar cuantos espacios se encuentran ocupados en la columna+1
        for( var fila=espacioOcupado; fila < numFila ; fila++){ //Recorrer las filas de la columna
          var imagen = imagenAleatoria() //Generar dulce aleatorio
          $('.col-'+(recorrerColumna)).prepend('<img src="image/'+ imagen  +'.png" class="elemento generado">') //Agregar elemento en la posicion anterior al ultimo elemento dentro de la columna
          var nuevoDulceGenerado = true //Estado de finalizacion de generación de nuevos dulces.
        }
      }
    }

    /*Agregar animacion de desplazamiento vertical utilizando los parametros de desplazamiento vertical por la cantidad de filas*/
    $('.elemento.generado').css({top: "-"+desplazamientoVertical*numFila+"px"}).animate({
      top: "+="+desplazamientoVertical*numFila,
    }, tiempoRetraso/2)//Utiliar la mitad del tiempo de retraco como tiempo de animación.

    if(nuevoDulceGenerado == true){ //Verificar si se generaron nuevos dulces.
      $('.generado').removeClass('generado') //Eliminar la clase "generado"
      matchElements() //Verificar que existan 
    }else{
      nuevoDulceGenerado = false //Cambiar estado de generacion de nuevos dulces es falso.
      habilitarMovimientos() //Rehabilitar los movimientos
    } 
  }

  function imagenAleatoria(){
    img = Math.floor(Math.random() * numDulces)+1; //Obtener ina imagen aleatoria
    return img;
  }

  function desplazarElemento(desplazamiento){  
    
    var imgActual = $(elementoOrigen).attr('src');
    var imgSustituir = $(elementoDestino).attr('src');

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

      setTimeout(sustituirElemento,tiempoRetraso) // Sustituir la imagen de los elementos intercambiados al terminar la animación de movimiento

      function sustituirElemento(){
        $(elementoDestino).attr({src:imgActual}).css({top:"0", left:"0", right:"0", bottom: "0"}); //Mantener el mimo id del elemento sustituido y asignarle la misma imagen del elemento de origen
        $(elementoOrigen).attr({src:imgSustituir}).css({top:"0", left:"0", right:"0", bottom: "0"}); //Mantener el mismo id del elemento actual y asignarle la imagen del elemento destino
        elementoDestino = ""; //Reiniciar el elemento destino
        elementoOrigen = ""; //Reiniciar el elemento destino
      }
      setTimeout(matchElements,tiempoRetraso) //Verificar los elementos consegutivos luego de intercambiar la posicion de los elementos
  }

  function matchElements(){
    deshabilitarMovimientos()
    /*Inicializar las matrices de elementos consecutivos*/
    var matchVertical = []; //Inicializar matríz de elementos consecutivos verticales
    var matchHorizontal = []; //Inicializar matríz de elementos consecutivos Horizontales
    matchDulcesConsecutivos = []; //Inicializar matríz principal de elementos consecutivos
    for (var i = 1; i < numFila+1; i++ ){ //Corelativo de la columna a recorrer. Empezando desde la columna-1
      for (var j = 0; j < (numColumnas-1); j++){ //Correlativo de filas iniciando en la posicion 0
        
        /*** Recorrer el tablero de manera vertical ***/
        if (matchVertical.length == 0){ //Verificar si la matríz vertical no posee elementos a comparar
              matchVertical.push(($(".col-"+i).children()[j])) //Agregar el primer elemento a la matríz a comparar
        }
        if ($(".col-"+i).children()[j].getAttribute('src') == $(".col-"+i).children()[(j+1)].getAttribute('src')){ //Comparar si la imagen del el primer elemento corresponde con el elemento hermano siguiente
            matchVertical.push(($(".col-"+i).children()[(j+1)])) //Agregegar el elemento a la matríz de elementos verticales consecutivos
          if (matchVertical.length >= 3){ //Verificar que existan tres elementos consecutivos
            for (var x = 0; x < matchVertical.length; x++){ //Recorrer las posiciones de la matríz Vertical
                  matchDulcesConsecutivos.push(matchVertical[x]) //Agregar los elementos consecutivos a la matríz principal
            }
          }
        }else{
            matchVertical = [] //Vaciar los elementos consecutivos si los dulces consegutivos son diferentes
        }
      
      /*** Recorrer el tablero de manera Horizontal  ***/
        if (matchHorizontal.length == 0){ //Verificar si la matríz vertical no posee elementos a comparar
              matchHorizontal.push(($(".col-"+(j+1)).children()[i-1])) //Agregar el primer elemento a la matríz a comparar
        }
        if ($(".col-"+(j+1)).children()[(i-1)].getAttribute('src') == $(".col-"+(j+2)).children()[(i-1)].getAttribute('src')){ //Comparar si la imagen del el primer elemento corresponde con el elemento hermano siguiente
            matchHorizontal.push(($(".col-"+(j+2)).children()[(i-1)])) //Agregegar el elemento a la matríz de elementos horizontales consecutivos
          if (matchHorizontal.length >= 3){ //Verificar que existan tres elementos consecutivos
            for (var x = 0; x < matchHorizontal.length; x++){ //Recorrer las posiciones de la matríz Horizontal
                  matchDulcesConsecutivos.push(matchHorizontal[x]) //Agregar los elementos consecutivos a la matríz principal
            }
          }
        }else{
            matchHorizontal = [] //Vaciar los elementos consecutivos si los dulces consegutivos son diferentes
        }
      }
      matchHorizontal = [] //Reiniciar la matriz horizontal al cambiar de columna
      matchVertical = [] //Reiniciar la matriz horizontal al cambiar de columna
    }

      for (var x = 0; x < matchDulcesConsecutivos.length; x++){
          $(matchDulcesConsecutivos[x]).addClass('matched') //Agregar clase matched a los elementos consecutivos
      }

    if(matchDulcesConsecutivos.length > 0){ //Verificar si existen dulces consecutivos
      efectoMatch() //Iniciar el efecto de consecutividad
    }else{
      habilitarMovimientos() //Rehabilitar movimientos
    }
  }

/*** Función de efecto parpadeo ***/
  function efectoMatch(){
        contadorEfecto++
        var puntos = Number(matchDulcesConsecutivos.length * valorDulce) //Totalizar la puntuación de los movimientos actuales.
        if(contadorEfecto < totalContadorEfecto){
           $('.matched').toggleClass('matchedEffect') //Intercalar agregar-remover clase matchedEffedt a los elementos hijos del panel-tablero que contengan la clase matched
           setTimeout(efectoMatch,tiempoEfecto)
           /***** Extra - Mensajes por puntuación *****/
           if(habilitarMensajes == true){
            switch (true){
               case (puntos == 30):
                  $('#mensaje').html("Bien!").show("fade", tiempoEfecto)
                break;

                case (puntos > 30 && puntos <= 90):
                  $('#mensaje').html("Genial!").show("fade", tiempoEfecto)
                break;

                case (puntos> 90 && puntos <=120):
                  $('#mensaje').html("Increíble!").show("fade", tiempoEfecto)
                break;

                case (puntos > 120):
                    $('#mensaje').html("Soprendente!").show("fade", tiempoEfecto)
                break

                default:
                  break
               }
            }
        }else{
           $('.matched').detach() //Remover los elementos consecutivos para regenerar nuevos elementos en su posiciones
           puntuacion = puntuacion + (puntos) //Sumar los puntos actuales a la puntuación total
           console.log("Sumar "+ puntos) //Mostrar puntos actuales en consola
           $('#score-text').html(puntuacion) //Cambiar la puntuación en el selector con ID score-text
           contadorEfecto = 0 //Reiniciar el contador de Efectos
           if(habilitarMensajes == true){
              $('#mensaje').hide("fade", tiempoEfecto/4)
            }
           regenerarDulces() //Llamar la función de generar dulces
        }
  }



});

  function habilitarMensajes(){
  
}
/*** Función de cronometro ***/
function iniciarCronometro(interval) {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        if(currentSeconds <= 9) currentSeconds = "0" + currentSeconds;
        secs--;
          $('#timer').html("0"+currentMinutes + ":" + currentSeconds)
        if(secs !== -1){
          setTimeout('iniciarCronometro('+interval+')',interval);
        }else{
          $('.panel-tablero, .time').hide('slow',"swing")
          $('.panel-tablero').before('<h1 class="titulo-over over-container">Juego Terminado</h1>')
          $('.panel-score').addClass('over-container')
          $('.panel-tablero, .time').remove()
        }
}