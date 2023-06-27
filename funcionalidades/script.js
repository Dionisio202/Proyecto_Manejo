document.addEventListener("DOMContentLoaded", function() {
  var btnAgregar = document.getElementById("btnAgregar");
  var formularioModal = document.getElementById("formularioModal");

  btnAgregar.addEventListener("click", function() {
    var bootstrapModal = new bootstrap.Modal(formularioModal);
    bootstrapModal.show();
  });

  var formulario = document.getElementById("formulario");
  var nombreTareaInput = document.getElementById("nombreTarea");
  var fechaInicioInput = document.getElementById("fechaInicio");
  var fechaFinalInput = document.getElementById("fechaFinal");
  var descripcionTextarea = document.getElementById("descripcion");

  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    var nombreTarea = nombreTareaInput.value;
    var fechaInicio = fechaInicioInput.value;
    var fechaFinal = fechaFinalInput.value;
    var descripcion = descripcionTextarea.value;

    nombreTareaInput.value = "";
    fechaInicioInput.value = "";
    fechaFinalInput.value = "";
    descripcionTextarea.value = "";

    var nuevaTarjeta = crearTarea(nombreTarea);


    var contenedorTarjetas = document.getElementById("contenedorTarjetas");
    contenedorTarjetas.appendChild(nuevaTarjeta);

    var bootstrapModal = bootstrap.Modal.getInstance(formularioModal);
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

});




function crearTarea(nombreTarea){

  var nuevaTarjetaCont = document.createElement("div");
  nuevaTarjetaCont.classList.add("card", "carta");

  nuevaTarjetaCont.innerHTML =  ` 
  <div class="card-header d-flex justify-content-between align-items-center">
    <h3 class="card-title small">Título de la tarea</h3>
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