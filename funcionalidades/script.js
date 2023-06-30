document.addEventListener("DOMContentLoaded", function() {
  
  
  //ENCONTRAMOS EL BOTON PARA QUE APAREZCA EL FORMULARIO PARA AGREGAR UNA TAREA
  const btnAgregar = document.getElementById("btnAgregar");

  //ENCONTRAMOS EL FORMULARIO PARA AGREGAR UNA TAREA
  const formularioModal = document.getElementById("formularioModal");
  
  const formulario = document.getElementById("formulario1");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS POR HACER
  const contenedorTareasPorHacer = document.getElementById("contenedorTareasPorHacer");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS EN PROCESO
  const contenedorTareasEnProceso = document.getElementById("contenedorTareasEnProceso");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS TERMINADAS
  const contenedorTareasTerminadas = document.getElementById("contenedorTareasHechas");
  
  //DEFINIMOS UNA VARIABLE QUE CONTENDRA LOS DATOS RECUPERADOS DEL ARCHIVO PHP
  var Datos = [];
  
  recuperarDatos();


  //EVENTO QUE AL APLASTARLO MUESTRA EL FORMULARIO PARA AGREGAR UNA TAREA
  btnAgregar.addEventListener("click", function() {
    var bootstrapModal = new bootstrap.Modal(formularioModal);
    bootstrapModal.show();
  });

  mostrar();


  //METODO PARA RECUPERAR LOS DATOS DEL ARCHIVO PHP
  function recuperarDatos() {
    axios.get('../Conexion/RecibirDatos.php')
    .then(response => {
      var datos = response.data; 
      UbicarTareas(datos);
    })
    .catch(error => console.log(error + " AQUI ES EL ERROR"));
  }
  
  
  //METODO PARA UBICAR LAS TAREAS DENTRO DEL CONTENEDOR. ADEMÁS, GUARDAMOS LAS TAREAS 
  //EN LA VARIABLE DATOS PARA TENER ACCESO MÁS ADELANTE
  function UbicarTareas(datos) {
    
    Datos = datos;
    datos.forEach(element => {
      console.log(element.ID_TAREA);
      var nuevaTarjeta = crearTarea(element.ID_TAREA,element.NOM_TAREA);
      contenedorTareasPorHacer.appendChild(nuevaTarjeta);
      
    });
  }

  
 //METODO PARA CREAR LAS TAREAS 
function crearTarea(id, nombreTarea){
  
  var nuevaTarjetaCont = document.createElement("div");
  nuevaTarjetaCont.classList.add("card", "carta");
  nuevaTarjetaCont.setAttribute("id", "Tarea-"+id);

  nuevaTarjetaCont.innerHTML =  ` 
  <div class="card-header d-flex justify-content-between align-items-center">
  <h3 class="card-title small">`+nombreTarea+`</h3>
  <div class="card-icons">
  <div class="d-flex">
  <button class="btn btn-success mr-2 rounded-circle">
  <span><i class="bi bi-check"></i></span>
  </button>
  <button class="btn btn-danger rounded-circle ms-2">
  <span><i class="bi bi-trash"></i></span>
  </button>
  </div>
  </div>
  </div>
  `;
  
  return nuevaTarjetaCont;
}

  
  formulario.addEventListener("s", function(event) {
    event.preventDefault();

    var nombreTarea = nombreTareaInput.value;
    var fechaInicio = fechaInicioInput.value;
    var fechaFinal = fechaFinalInput.value;
    var descripcion = descripcionTextarea.value;

    nombreTareaInput.value = "";
    fechaInicioInput.value = "";
    fechaFinalInput.value = "";
    descripcionTextarea.value = "";

    //var nuevaTarjeta = crearTarea(nombreTarea);


    //var contenedorTarjetas = document.getElementById("contenedorTarjetas");
    //contenedorTarjetas.appendChild(nuevaTarjeta);

    //var bootstrapModal = bootstrap.Modal.getInstance(formularioModal);
    bootstrapModal.hide();
  });


  var cartas = document.querySelectorAll('.carta');
cartas.forEach(function(carta) {
  console.log("asdasdddddddddd");
  carta.addEventListener('click', function() {
    // Obtener datos de la carta seleccionada
    var titulo = carta.querySelector('.titulo').textContent;
    console.log("asdasdddddddddd");

    // Crear el elemento modal dinámicamente
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">${titulo}</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${descripcion}</p>
          </div>
        </div>
      </div>
    `;

    // Agregar el modal al documento
    document.body.appendChild(modal);

    // Mostrar el modal utilizando Bootstrap
    var bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  });
});







function mostrar(){
  console.log(Datos +"   Soy DATOS");
}


});