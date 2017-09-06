  //Definir variables globales
  var col = new Array();
  var colA = new Array();
  var colB = new Array();
  var colC = new Array();
  var colD = new Array();
  var colE = new Array();
  var colF = new Array();
  var colG = new Array();
  var reiniciar = true; //Iniciar el tablero
  var columnaActual = "";
  var col = "";

$(function(){
   //Iniciar funcion de cambio de color. Repetirla cada 1.5segundos
  setInterval(titleColor, 1500);

  if (reiniciar == true){
      //col = colA
      generarDulces();
  }else{
      generarDulces();
  }


  $( ".elemento" ).draggable({
    drag: function(){
      elementoActual = $(this)
      columnaActual = $(this).parent()[0].getAttribute("class"); //Seleccionar el elemento padre y seleccionar la columna a la cual pertenece el elemento
      console.log(columnaActual);
    },
    grid: [ 120, 96 ],
    axis: "xy",
    containment: columnaActual,
  });
  $( ".elemento" ).droppable({
    drop: function( event, ui ) {
      desplazarElemento(elementoActual,$(this))
      console.log($(this));
      //col = $(columnaActual).getAttribute('class').substr(4,1)
      //console.log(col); //Obtener el numero de columna del elemento a traves de la clase
    }, accept: ".elemento"  // permitir solo soltar el elemento en la columna anterior, actual o siguiente del elemento actual
  });
});


//Cambiar color del titulo
function titleColor(){
  $('.main-titulo').toggleClass('main-titulo-inverse')
}

//generar nuevos dlces
function generarDulces(){
  var j = 0;
  /*Verificar Primera Columna*/
  var espacioOcupado = colA.length
  for( var i=espacioOcupado; i < 7 ; i++){
    if(!col[i]){ //Vedificar que haya un espacio vacio
      var imagen = imagenAleatoria()
      $('.col-1').prepend('<img id="'+(i+1)+'" src="image/'+ imagen  +'.png" class="elemento">')
      colA.push(imagen)
    }
    j++
  }
  for( var i=espacioOcupado; i < 7 ; i++){
    if(!col[i]){ //Vedificar que haya un espacio vacio
      var imagen = imagenAleatoria()
      $('.col-2').prepend('<img id="'+(i+8)+'" src="image/'+ imagen +'.png" class="elemento">')
      colB.push(imagen)
    }
    j++
  }
}

function imagenAleatoria(){
  img = Math.floor(Math.random() * 4)+1 //Obtener ina imagen aleatoria
  //console.log(img);
  return img;
}


function desplazarElemento(elementoActual, elementoSustituir){
  //console.log($(elementoActual));
  console.log($(elementoSustituir));

  imagenActual = $(elementoActual).attr('src')
  idActual = $(elementoActual).attr('id')

  imagenSustituir = $(elementoSustituir).attr('src')
  idSustituir = $(elementoSustituir).attr('id')

  console.log(imagenSustituir);
  console.log(idSustituir);

  console.log(imagenActual);
  console.log(idActual);
  elementoSustituir.animate({
    /*left: "-=120"*/
  }, 750, function(){

    direccion = idActual - idSustituir
    if(direccion == -7){ //Mover Derecha
      console.log("moviendo a la derecha");
      $(elementoSustituir).animate({
        left: "-=120"
      }),750
    }
    if(direccion == 7){ //Mover Izquierda
      console.log("moviendo a la izquierda");
      $(elementoSustituir).animate({
        left: "+=120"
      }),750
    }

    if(direccion == -1){ //Mover Arriba
      console.log("moviendo a Arriba");
      $(elementoSustituir).animate({
        top: "+=96"
      }),750
    }
    if(direccion == 1){ //Mover Abajo
      console.log("moviendo a Abajo");
      $(elementoSustituir).animate({
        top: "-=96"
      }),750
    }

    console.log(direccion);
    //$(elementoSustituir).detach()
    //$(elementoSustituir).clone().insertBefore("#"+idSustituir)
    setInterval(sustituirElemento, 750)

    function sustituirElemento(){
      $(elementoSustituir).attr({id:idSustituir, src : imagenActual}).css({top:"0", left:"0", right:"0", bottom: "0"})
      $(elementoActual).attr({id : idActual, src : imagenSustituir}).css({top:"0", left:"0", right:"0", bottom: "0"})
      elementoSustituir = ""
      elementoActual = ""
    }

    //$(elementoSustituir).insertBefore("#"+idActual)







    console.log("E");
  }
)
}
