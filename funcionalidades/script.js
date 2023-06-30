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

      });
      var boton = nuevaTarjeta.querySelector(".pasarEnProceso");

      boton.addEventListener("click", function () {

      event.stopPropagation();
      console.log("Botón presionado en la tarea con ID: " + nuevaTarjeta.id);
      
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
  <button class="btn btn-danger rounded-circle ms-2">
  <span><i class="bi bi-trash"></i></span>
  </button>
  </div>
  </div>
  </div>
  `;

    return nuevaTarjetaCont;
  }


  //METODO PARA MOSTRAR LA INFORMACIÓN DE LA TAREA
  var idTarea = document.querySelectorAll(".pasarEnProceso");
  console.log(idTarea.length);
  idTarea.forEach(function (carta) {

    carta.addEventListener('click', function () {

      var id = this.id;
      console.log(id);

    });
  });






  function mostrar() {
    Datos.forEach(element => {
      console.log(element.NOM_TAREA);
    });
    console.log(Datos + "   Soy DATOS");
  }


});