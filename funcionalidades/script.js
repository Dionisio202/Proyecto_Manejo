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

    var nuevaTarjeta = document.createElement("div");
    nuevaTarjeta.classList.add("carta");

    var nuevaTarjetaHTML = `
      <div class="card-body">
        <h5 class="card-title">${nombreTarea}</h5>
        <p class="card-text">${descripcion}</p>
      </div>
    `;

    nuevaTarjeta.innerHTML = nuevaTarjetaHTML;

    var contenedorTarjetas = document.querySelector(".container-fluid.custom-border.h-100");
    contenedorTarjetas.appendChild(nuevaTarjeta);

    var bootstrapModal = bootstrap.Modal.getInstance(formularioModal);
    bootstrapModal.hide();
  });

  var cartas = document.querySelectorAll('.carta');
  cartas.forEach(function(carta) {
    carta.addEventListener('click', function() {
      var modal = document.getElementById('myModal');
      var bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    });
  });
});
