document.addEventListener("DOMContentLoaded", function () {


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
  btnAgregar.addEventListener("click", function () {
    var bootstrapModal = new bootstrap.Modal(formularioModal);
    bootstrapModal.show();

    mostrar();
  });



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
      var nuevaTarjeta = crearTarea(element.ID_TAREA, element.NOM_TAREA);

      nuevaTarjeta.addEventListener('click', function () {

        var id = this.id;
        console.log(id);

        mostrarInformacionTarea(element.NOM_TAREA, element.DESCRIPCION)

      });
      var botonCambiar = nuevaTarjeta.querySelector(".pasarEnProceso");


      botonCambiar.addEventListener("click", function () {

        event.stopPropagation();
        console.log("Botón presionado en la tarea con ID: " + nuevaTarjeta.id);
        
      });


      var botonBorrar = nuevaTarjeta.querySelector(".borrar ");

      botonBorrar.addEventListener("click", function () {

        event.stopPropagation();

        confirmAction(function(option) {
          if (option) {
            var id = nuevaTarjeta.id.split("-")[1];

            //METODO QUE BORRA LA TAREA
            borrarTarea(id);
            
            window.location.href = '../index.html';

          } else {
            console.log('El usuario canceló');
          }
        });

      });







      contenedorTareasPorHacer.appendChild(nuevaTarjeta);
    });
  }


  //METODO PARA CREAR LAS TAREAS 
  function crearTarea(id, nombreTarea) {

    var nuevaTarjetaCont = document.createElement("div");
    nuevaTarjetaCont.classList.add("card", "carta");
    nuevaTarjetaCont.setAttribute("id", "Tarea-" + id);

    nuevaTarjetaCont.innerHTML = ` 
  <div class="card-header d-flex justify-content-between align-items-center">
  <h3 class="card-title small">`+ nombreTarea + `</h3>
  <div class="card-icons">
  <div class="d-flex">
  <button class="btn btn-success mr-2 rounded-circle pasarEnProceso">
  <span><i class="bi bi-check"></i></span>
  </button>
  <button class="btn btn-danger rounded-circle ms-2 borrar">
  <span><i class="bi bi-trash"></i></span>
  </button>
  </div>
  </div>
  </div>
  `;

    return nuevaTarjetaCont;
  }


  //METODO PARA MOSTRAR LA INFORMACIÓN DE LA TAREA
  function mostrarInformacionTarea(titulo, descripcion) {

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
  }

  //BORRAR TAREA 
  function borrarTarea(id) {

    const url = '../Conexion/BorrarTarea.php';
    var data = { id: id};

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  //MOVER TAREA 
  function moverTarea(estadoAnterior, id) {

    var estado = '';

    if(estadoAnterior == 'PHA'){
      estado = 'EPR';
    }
    else if(estadoAnterior == 'EPR'){
      estado = 'HEC';
    }else{
      return;
    }


    const url = '../Conexion/BorrarTarea.php';
    var data = { id: id, estado: estadoAnterior};

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  //VENTANA EMERGENTE 

 

    const ventanaEmergente = `<div id="confirm-dialog">
    <div class="message">¿Estás seguro?</div>
    <button id="confirm-button" class=" buttonAlert ">Aceptar</button>
    <button id="cancel-button" class=" buttonAlert ">Cancelar</button>
  </div>`

  
    // JavaScript
  var confirmDialog = document.getElementById('confirm-dialog');
  var confirmButton = document.getElementById('confirm-button');
  var cancelButton = document.getElementById('cancel-button');
  


  function confirmAction(callback) {
    confirmDialog.style.display = 'block';
  
    function handleConfirm() {
      confirmDialog.style.display = 'none';
      callback(true); // El usuario ha elegido "Aceptar"
    }
  
    function handleCancel() {
      confirmDialog.style.display = 'none';
      callback(false); // El usuario ha elegido "Cancelar"
    }
  
    confirmButton.addEventListener('click', handleConfirm);
    cancelButton.addEventListener('click', handleCancel);
  }







  function mostrar() {
    Datos.forEach(element => {
      console.log(element.NOM_TAREA);
    });
    console.log(Datos + "   Soy DATOS");
  }


});