
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
      // Este es el codigo para cuando se da guardar 
      var nombreTarea = nombreTareaInput.value;
      var fechaInicio = fechaInicioInput.value;
      var fechaFinal = fechaFinalInput.value;
      var descripcion = descripcionTextarea.value;
  
    
      nombreTareaInput.value = "";
      fechaInicioInput.value = "";
      fechaFinalInput.value = "";
      descripcionTextarea.value = "";
  
      var bootstrapModal = bootstrap.Modal.getInstance(formularioModal);
      bootstrapModal.hide();
    });
  });
  