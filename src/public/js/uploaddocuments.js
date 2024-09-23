const form = document.getElementById('uploadForm');

form.addEventListener('submit', function(event) {
  const dniFront = document.getElementById('dniFront').files[0];
  const dniBack = document.getElementById('dniBack').files[0];
  const selfie = document.getElementById('selfie').files[0];

  if (!dniFront || !dniBack || !selfie) {
    event.preventDefault();
    alert('Por favor, sube los tres documentos requeridos (DNI Frente, DNI Dorso y Selfie).');
  }
});