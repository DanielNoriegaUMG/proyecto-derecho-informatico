document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      console.log(username.value);
      console.log(password.value);
  
      if (username.value === 'admin' && password.value === 'admin') {
        window.location.href = 'paginaCompras.html';
      } else {
        alert('Nombre de usuario o contraseña incorrectos. Por favor, inténtalo nuevamente.');
      }
    });
  });
  