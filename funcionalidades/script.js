document.addEventListener("DOMContentLoaded", function () {

  console.log("DOM Cargado");

  //ENCONTRAMOS EL BOTON PARA QUE APAREZCA EL FORMULARIO PARA AGREGAR UNA TAREA
  const btnAgregar = document.getElementById("btnAgregar");

  //ENCONTRAMOS EL FORMULARIO PARA AGREGAR UNA TAREA
  const formularioModal = document.getElementById("formularioModal");

  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS POR HACER
  const contenedorTareasPorHacer = document.getElementById("contenedorTareasPorHacer");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS EN PROCESO
  const contenedorTareasEnProceso = document.getElementById("contenedorTareasEnProceso");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS TERMINADAS
  const contenedorTareasTerminadas = document.getElementById("contenedorTareasHechas");

  //ENCONTRAMOS LA VENTANA EMERGENTE Y LOS BOTONES DE CONFIRMAR Y CANCELAR
  const confirmDialog = document.getElementById('confirm-dialog');
  const confirmButton = document.getElementById('confirm-button');
  const cancelButton = document.getElementById('cancel-button');
  

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

    reiniciarDatos();

    Datos = datos;
    datos.forEach(element => {
      var nuevaTarjeta = crearTarea(element.ID_TAREA, element.NOM_TAREA);

      nuevaTarjeta.addEventListener('click', function () {

        var id = this.id;
        console.log(id);

        mostrarInformacionTarea(element.ID_TAREA,element.NOM_TAREA, element.DESCRIPCION, element.FEC_INI, element.FEC_FIN);
        
        var botonEditar = document.getElementById("editarTarea");

        habilitarActualizacion(botonEditar);
      

      });


      var botonCambiar = nuevaTarjeta.querySelector(".pasarEnProceso");


      botonCambiar.addEventListener("click", function () {

        event.stopPropagation();
        console.log("Botón presionado en la tarea con ID: " + nuevaTarjeta.id);
        var id = nuevaTarjeta.id.split("-")[1];

        moverTarea(element.ESTADO,id)
        
        //window.location.reload();
        recuperarDatos();
      });


      var botonBorrar = nuevaTarjeta.querySelector(".borrar ");

      botonBorrar.addEventListener("click", function () {

        event.stopPropagation();

        confirmAction(function(option) {
          if (option) {

            var id = nuevaTarjeta.id.split("-")[1];

            //METODO QUE BORRA LA TAREA
            borrarTarea(id);

          recuperarDatos();  
        //window.location.reload();

          } else {
            console.log('El usuario canceló');
          }
        });

      });

      console.log(element.ID_TAREA+""+element.ESTADO);

      ubicacionTarea(element.ESTADO).appendChild(nuevaTarjeta);

      if(element.ESTADO == 'HEC'){

        botonCambiar.style.display = "none";
      }

    });
  }

  //ESCOGE EL CONTENEDOR DEPENDIENDO EL ESTADO DE LA TAREA
  function ubicacionTarea(estado){

    if(estado == 'PHA'){
      return contenedorTareasPorHacer;
    }
    else if(estado == 'EPR'){
      return contenedorTareasEnProceso;
    }
    else if(estado == 'HEC'){
      return contenedorTareasTerminadas;
    }
    return null;
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
  function mostrarInformacionTarea(id,titulo, descripcion, fechaInicio, fechaFin) {

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="" id="formularioActualizar" tabindex="-1" aria-labelledby="formularioModalLabel"
    aria-hidden="true">
   <div class="modal-dialog">
       <div class="modal-content">
           <div class="modal-header">
               <h5 class="modal-title " id="formularioModalLabel">Tareas</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
               <form method="POST" action="../Conexion/ActualizarDatos.php" id="formulario">
                   <div class="mb-3">
                       <label for="nombreTarea" class="form-label">Nombre de Tarea:</label>
                       <input type="text" class="form-control bloqueado" id="nombreTarea2" name="nombreTarea" value = "${titulo}" readOnly>
                   </div>
                   <div class="mb-3">
                       <label for="fechaInicio" class="form-label">Fecha de Inicio:</label>
                       <input type="date" class="form-control bloqueado" id="fechaInicio2" name="fechaInicio"  value = "${fechaInicio}" readOnly>
                   </div>
                   <div class="mb-3">
                       <label for="fechaFinal" class="form-label">Fecha Final:</label>
                       <input type="date" class="form-control bloqueado" id="fechaFinal2" name="fechaFinal" value = "${fechaFin}" readOnly>
                   </div>

                   <div class="mb-3">
                       <label for="fechaFinal" class="form-label">Estado</label>
                    
                       <select name="estado" class="form-select" aria-label="Default select example" required>
                          <option selected disable>Seleccionar estado</option>
                          <option value="PHA" >Por hacer</option>
                          <option value="EPR" >En proceso</option>
                          <option value="HEC" >Hechas</option>
                        </select>
                    </div>


                   <div class="mb-3">
                       <label for="descripcion" class="form-label">Descripción:</label>
                       <textarea class="form-control bloqueado" id="descripcion2" name="descripcion"  readOnly>${descripcion}</textarea>
                       <input type="text"  id="idTarea" name="idTarea" value = "${id}" style="display:none;">
                   </div>

                   <div class= "button-container">
                   <button type="button" class="btn btn-primary" id="editarTarea" >Editar</button>

                   <button type="submit" class="btn btn-primary" style="display: none;" id= "guardarTarea">Guardar</button>
                                      
                   </div>
               </form>
           </div>
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

  //METODO PARA HABILITAR LA ACTUALIZACION DE LA TAREA
  function habilitarActualizacion(botonEditar) {

    botonEditar.addEventListener("click", function () {
      console.log("se presiono el boton editar")

      this.style.display = "none";

      var botonGuardar = document.getElementById("guardarTarea");
      botonGuardar.style.display = "block";

      var titulo = document.getElementById("nombreTarea2");
      titulo.classList.remove("bloqueado")
      titulo.readOnly =false;
      titulo.required = true;

      var fechaInicio = document.getElementById("fechaInicio2");
      fechaInicio.classList.remove("bloqueado")
      fechaInicio.readOnly =false;
      fechaInicio.required = true;

      var fechaFin = document.getElementById("fechaFinal2");
      fechaFin.classList.remove("bloqueado")
      fechaFin.readOnly =false;
      fechaFin.required = true;

      var descripcion = document.getElementById("descripcion2");
      descripcion.classList.remove("bloqueado")
      descripcion.readOnly =false;
      descripcion.required = true;

    });

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

    const url = '../Conexion/ActualizarEstado.php';
    var data = { id: id, estado: estado};

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


  function reiniciarDatos(){

    contenedorTareasTerminadas.innerHTML = '';
    contenedorTareasEnProceso.innerHTML = '';
    contenedorTareasPorHacer.innerHTML = '';

  }



  function mostrar() {
    Datos.forEach(element => {
      console.log(element.NOM_TAREA);
    });
    console.log(Datos + "   Soy DATOS");
  }


});