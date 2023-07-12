document.addEventListener("DOMContentLoaded", function () {

  console.log("DOM Cargado");

  //ENCONTRAMOS EL BOTON PARA QUE APAREZCA EL FORMULARIO PARA AGREGAR UNA TAREA
  const btnAgregar = document.getElementById("btnAgregar");

  const btnBorrar = document.getElementById("btnBorrar");

  //ENCONTRAMOS EL FORMULARIO PARA AGREGAR UNA TAREA
  const formularioModal = document.getElementById("formularioModal");

  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS POR HACER
  const contenedorTareasPorHacer = document.getElementById("contenedorTareasPorHacer");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS EN PROCESO
  const contenedorTareasEnProceso = document.getElementById("contenedorTareasEnProceso");
  //ENCONTRAMOS EL CONTENEDOR DE LAS TARJETAS TERMINADAS
  const contenedorTareasTerminadas = document.getElementById("contenedorTareasHechas");


  //ENCONTRAMOS LA VENTANA EMERGENTE Y LOS BOTONES DE CONFIRMAR Y CANCELAR
  const over = document.getElementById('over');
  const confirmDialog = document.getElementById('confirm-dialog');
  const confirmButton = document.getElementById('confirm-button');
  const cancelButton = document.getElementById('cancel-button');

//ENCONTRAMOS EL BOTON PARA TRABAJAR
  const trabajar = document.getElementById("trabajar");


  //DEFINIMOS UNA VARIABLE QUE CONTENDRA LOS DATOS RECUPERADOS DEL ARCHIVO PHP
  var Datos = [];

  recuperarDatos();


  //REGISTRO EQUIPO DE TRABAJO

  const btnAgregarUser = document.getElementById("agregarUser");
  const btneliminarUser = document.getElementById("eliminarUser");
  const contenedorUser = document.getElementById("contenedorUser");

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


        mostrarInformacionTarea(element.ID_TAREA, element.NOM_TAREA, element.DESCRIPCION, element.FEC_INI, element.FEC_FIN, element.ESTADO);



        var botonEditar = document.getElementById("editarTarea");

        habilitarActualizacion(botonEditar);

        var botonCerrar = document.getElementById("cerrar");

        botonCerrar.addEventListener("click", function () {

          var modal = document.getElementById("formularioActualizar");
          modal.remove();


        });


        var botonEliminar = document.getElementById("eliminarTarea");

        botonEliminar.addEventListener("click", function () {


          if (event.target.id == "eliminarTarea") {

            console.log("ENTRE AL BOTON")

            over.style.display = 'block';
            confirmDialog.style.display = 'block';

            confirmAction(function (option) {

              if (option) {

                var id = nuevaTarjeta.id.split("-")[1];

                //METODO QUE BORRA LA TAREA
                borrarTarea(id);

                window.location.reload();

              } else {
                console.log('El usuario canceló');

              }

            });

          }
        });


      });


      var botonCambiar = nuevaTarjeta.querySelector(".pasarEnProceso");


      botonCambiar.addEventListener("click", function () {

        botonCambiar.style.color ="red";

        event.stopPropagation();
        console.log("Botón presionado en la tarea con ID: " + nuevaTarjeta.id);
        var id = nuevaTarjeta.id.split("-")[1];

        moverTarea(element.ESTADO, id)

        //window.location.reload();
        recuperarDatos();
      });



      console.log(element.ID_TAREA + " " + element.ESTADO);

      ubicacionTarea(element.ESTADO).appendChild(nuevaTarjeta);

      if (element.ESTADO == 'HEC') {

        botonCambiar.style.display = "none";
        var contenedorBoton = document.getElementById("botones"+element.ID_TAREA);
        
        console.log(contenedorBoton);

        var terminado = document.createElement("div");
        terminado.innerHTML = `<h6 class="text-success">Tarea terminada</h6>`;
        contenedorBoton.appendChild(terminado);
      }

    });
  }

  //ESCOGE EL CONTENEDOR DEPENDIENDO EL ESTADO DE LA TAREA
  function ubicacionTarea(estado) {

    if (estado == 'PHA') {
      return contenedorTareasPorHacer;
    }
    else if (estado == 'EPR') {
      return contenedorTareasEnProceso;
    }
    else if (estado == 'HEC') {
      return contenedorTareasTerminadas;
    }
    return null;
  }


  //METODO PARA SELECCIONAR EL ID

  function seleccionarIDtarjeta() {

    return document.getElementById("idTarea").value;
  }


  //METODO PARA CREAR LAS TAREAS 
  function crearTarea(id, nombreTarea) {

    if (nombreTarea.length > 22) {
      nombreTarea = nombreTarea.substring(0, 22) + "...";
    }

    var nuevaTarjetaCont = document.createElement("div");
    nuevaTarjetaCont.classList.add("card", "carta");
    nuevaTarjetaCont.setAttribute("id", "Tarea-" + id);

    nuevaTarjetaCont.innerHTML = ` 
  <div class="card-header d-flex justify-content-between align-items-center">
  <h3 class="card-title small">`+ nombreTarea + `</h3>
  <div class="card-icons">
  <div class="d-flex" id="botones${id}">
  <button type="button" class="btn btn-info  btn-circle btn-lg pasarEnProceso">
  <i class="bi bi-arrow-right icon-arrow"></i></i>
  </button>
  </div>
  </div>
  </div>
  `;

    return nuevaTarjetaCont;
  }


  //METODO PARA MOSTRAR LA INFORMACIÓN DE LA TAREA
  function mostrarInformacionTarea(id, titulo, descripcion, fechaInicio, fechaFin, estado) {

    var pos1;
    var pos2;
    var pos3;
    if(estado == 'PHA'){
      pos1 = ['Por Hacer', 'PHA'];
      pos2 = ['En Proceso', 'EPR'];
      pos3 = ['Hecha', 'HEC'];
    }else if(estado == 'EPR'){
      pos1 = ['En Proceso', 'EPR'];
      pos2 = ['Por Hacer', 'PHA'];
      pos3 = ['Hecha', 'HEC'];
    }else if(estado == 'HEC'){
      pos1 = ['Hecha', 'HEC'];
      pos2 = ['Por Hacer', 'PHA'];
      pos3 = ['En Proceso', 'EPR'];
    }


    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'formularioActualizar';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
    <div class=""  tabindex="-1" aria-labelledby="formularioModalLabel"
    aria-hidden="true">
   <div class="modal-dialog">
       <div class="modal-content">
           <div class="modal-header">
               <h5 class="modal-title " id="formularioModalLabel">Tareas</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrar"></button>
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
                    
                       <select name="estado" class="form-select" aria-label="Default select example" id="estado" disabled>
                          <option value="${pos1[1]}" >${pos1[0]}</option>
                          <option value="${pos2[1]}" >${pos2[0]}</option>
                          <option value="${pos3[1]}" >${pos3[0]}</option>
                        </select>
                    </div>


                   <div class="mb-3">
                       <label for="descripcion" class="form-label">Descripción:</label>
                       <textarea class="form-control bloqueado textarea-desplazable" id="descripcion2" name="descripcion" rows="5"  readOnly>${descripcion}</textarea>
                       <input type="text"  id="idTarea" name="idTarea" value = "${id}" style="display:none;">
                   </div>

                   <div id="estado"></div>

                   <div class= "button-container">
                   <button type="button" class="btn btn-primary" id="editarTarea" >Editar</button>

                   <button type="submit" class="btn btn-primary" style="display: none;" id= "guardarTarea">Guardar</button>

                   <button type="button" class="btn btn-danger" id="eliminarTarea" style="margin-left: 10px;" >Eliminar</button>

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
      titulo.readOnly = false;
      titulo.required = true;

      var fechaInicio = document.getElementById("fechaInicio2");
      fechaInicio.classList.remove("bloqueado")
      fechaInicio.readOnly = false;
      fechaInicio.required = true;

      var fechaFin = document.getElementById("fechaFinal2");
      fechaFin.classList.remove("bloqueado")
      fechaFin.readOnly = false;
      fechaFin.required = true;

      var descripcion = document.getElementById("descripcion2");
      descripcion.classList.remove("bloqueado")
      descripcion.readOnly = false;
      descripcion.required = true;

      var estado = document.getElementById("estado");
      estado.disabled = false;


    });

  }


  //BORRAR TAREA 
  function borrarTarea(id) {

    const url = '../Conexion/BorrarTarea.php';
    var data = { id: id };

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

    if (estadoAnterior == 'PHA') {
      estado = 'EPR';
    }
    else if (estadoAnterior == 'EPR') {
      estado = 'HEC';
    } else {
      return;
    }

    const url = '../Conexion/ActualizarEstado.php';
    var data = { id: id, estado: estado };

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

  var eventHandlersAdded = false;

  function confirmAction(callback) {


    function handleConfirm() {
      over.style.display = 'none';
      confirmDialog.style.display = 'none';
      callback(true); // El usuario ha elegido "Aceptar"
    }

    function handleCancel() {
      over.style.display = 'none';
      confirmDialog.style.display = 'none';
      callback(false); // El usuario ha elegido "Cancelar"
    }

    if (!eventHandlersAdded) {
      confirmButton.addEventListener("click", handleConfirm);
      cancelButton.addEventListener("click", handleCancel);
      eventHandlersAdded = true;
    }

  }




  function reiniciarDatos() {

    contenedorTareasTerminadas.innerHTML = '';
    contenedorTareasEnProceso.innerHTML = '';
    contenedorTareasPorHacer.innerHTML = '';

  }



  function mostrar(event) {
    Datos.forEach(element => {
      console.log(element.NOM_TAREA);
    });
    console.log(Datos + "   Soy DATOS");
  }



  btnBorrar.addEventListener("click", function () {

    console.log("ENTRE AL BOTON")

            over.style.display = 'block';
            confirmDialog.style.display = 'block';

            confirmAction(function (option) {

              if (option) {

                window.location.href = "../Conexion/BorrarTodo.php";


              } else {
                console.log('El usuario canceló');

              }

            });
  });


  btnAgregarUser.addEventListener("click", function () {

    var users = `
    <div class="input-group mb-2 contUser"  >
    <div class="input-group-prepend">
      <span class="input-group-text spanUser"  style="height: 2rem; background-color: #412c67; border: 1px solid #412c67;" ><i class="bi bi-people"></i></span>
    </div>
    <input  name ="nombre[]" type="text" style="height: 2rem;" class="form-control inputUsuario" placeholder="Ingresa el usuario"  required>
</div>

<div class="input-group mb-3 contUser"  >
    <div class="input-group-prepend">
      <span class="input-group-text spanUser"style="height: 2rem; background-color: #412c67; border: 1px solid #412c67;" ><i class="bi bi-envelope"></i></span>
    </div>
    <input name ="email[]" style="height: 2rem;" type="email" class="form-control inputUsuario" placeholder="Ingresa de email" required>
</div>   
    `

    var cont = document.createElement("div");

    cont.innerHTML = users; 

    contenedorUser.appendChild(cont);

  });



});