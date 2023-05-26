document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      if (username.value === 'admin' && password.value === 'admin') {
          Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario aceptado',
          showConfirmButton: false,
          timer: 1500
        })
        
        setTimeout(function() {
            window.location.href = 'paginaCompras.html'
          }, 3000);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ocurrio un error en las credenciales',
          showConfirmButton: false,
          timer: 1500
      
        })
      }
});
  