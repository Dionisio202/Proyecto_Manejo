
const contenedorFormulario = document.getElementById('btnAgregar');

botonAgregar.addEventListener('click', function() {
  
    const formulario = document.createElement('form');

    // Agregar campos y elementos al formulario
    // ...

    // Agregar el formulario al contenedor
    contenedorFormulario.appendChild(formulario);
});
