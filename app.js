fetch('http://localhost:5000/api/pacientes') // Cambiamos la ruta
    .then(response => response.json())
    .then(data => {
        const contenedorPacientes = document.getElementById('container-pacientes');

        data.pacientes.forEach((paciente) => {
            const botonPaciente = document.createElement('button');
            botonPaciente.type = 'button';
            botonPaciente.classList.add('botonesPacientes', 'btn', 'btn-primary');
            botonPaciente.setAttribute('data-bs-toggle', 'modal');
            botonPaciente.setAttribute('data-bs-target', `#modalPaciente${paciente.id}`); // ID único para cada modal
            botonPaciente.textContent = paciente.datosPersonales?.nombre || 'Paciente sin nombre';

            contenedorPacientes.appendChild(botonPaciente);

            const modal = document.createElement('div');
            modal.classList.add('modal', 'fade');
            modal.id = `modalPaciente${paciente.id}`;
            modal.setAttribute('aria-labelledby', `modalPacienteLabel${paciente.id}`);
            modal.setAttribute('aria-hidden', 'true');
            const mostrarDatos = (datos, prefijo = '') => {
                let contenido = '';
                Object.entries(datos || {}).forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        contenido += mostrarDatos(value, prefijo + key + '.');
                    } else {
                        contenido += `<p><strong>${prefijo + key}:</strong> ${value}</p>`;
                    }
                });
                return contenido;
            };

            // Generar el contenido del modal-body dinámicamente
            let modalBodyContent = '';

            // Agregar datos generales del paciente
            if (paciente.datosPersonales) {
                modalBodyContent += '<h3>Datos Personales:</h3>';
                modalBodyContent += mostrarDatos(paciente.datosPersonales);
            }

            // Agregar datos de familiares
            if (paciente.familiares && paciente.familiares.length > 0) {
                modalBodyContent += '<hr>';
                modalBodyContent += '<h3>Familiares:</h3>';
                paciente.familiares.forEach((familiar, index) => {
                    modalBodyContent += `<p><strong>Familiar ${index + 1}${index === 0 ? ' (Primer Familiar)' : ''}:</strong></p>`;
                    modalBodyContent += mostrarDatos(familiar, 'familiar_');
                });
            }

            // Agregar condiciones preexistentes
            if (paciente.condicionesPreexistentes && paciente.condicionesPreexistentes.length > 0) {
                modalBodyContent += '<hr>';
                modalBodyContent += '<h3>Condiciones Preexistentes:</h3>';
                paciente.condicionesPreexistentes.forEach((condicion, index) => {
                    // Agregar etiqueta de familiar (si aplica)
                    modalBodyContent += `<p><strong>Familiar ${index + 1}${index === 0 ? ' (Primer Familiar)' : ''}:</strong></p>`;
                    modalBodyContent += mostrarDatos(condicion, 'condicion_');
                });
            }

            // Agregar internamientos
            if (paciente.internamientos && paciente.internamientos.length > 0) {
                modalBodyContent += '<hr>';
                modalBodyContent += '<h3>Internamientos:</h3>';
                paciente.internamientos.forEach((internamiento, index) => {
                    // Agregar etiqueta de familiar (si aplica)
                    modalBodyContent += `<p><strong>Familiar ${index + 1}${index === 0 ? ' (Primer Familiar)' : ''}:</strong></p>`;
                    modalBodyContent += mostrarDatos(internamiento, 'internamiento_');
                });
            }

            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalPacienteLabel${paciente.id}">Datos de ${paciente.datosPersonales?.nombre || 'Paciente'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${modalBodyContent}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        });
    })
    .catch(error => console.error('Error al cargar los pacientes:', error));

// solicitud para actualizar 

// Primer formulario
document.getElementById('pacienteForm').addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('Formulario 1 enviado');
  const formData = new FormData(this);
  const paciente = {
      id: formData.get('id'),
      datosPersonales: {
          nombre: formData.get('nombre'),
          edad: formData.get('edad')
      },
      familiares: Array.from(document.querySelectorAll('#familiaresContainer .familiar')).map(familiar => ({
          nombre: familiar.querySelector('[name="familiarNombre[]"]').value,
          parentesco: familiar.querySelector('[name="parentesco[]"]').value,
          edad: familiar.querySelector('[name="familiarEdad[]"]').value
      })),
      condicionesPreexistentes: Array.from(document.querySelectorAll('#condicionesContainer .condicion')).map(condicion => ({
          enfermedad: condicion.querySelector('[name="enfermedad[]"]').value,
          tiempo: condicion.querySelector('[name="tiempo[]"]').value,
          detalle: condicion.querySelector('[name="detalle[]"]').value
      })),
      internamientos: Array.from(document.querySelectorAll('#internamientosContainer .internamiento')).map(internamiento => ({
          fecha: internamiento.querySelector('[name="fecha[]"]').value,
          centroMedico: internamiento.querySelector('[name="centroMedico[]"]').value,
          diagnostico: internamiento.querySelector('[name="diagnostico[]"]').value
      }))
  };

  fetch('http://localhost:5000/api/pacientes', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(paciente)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Respuesta del servidor:', data);
      document.getElementById('pacienteForm').reset();
  })
  .catch(error => console.error('Error:', error));
});

// Segundo formulario (modificado)
document.getElementById('pacienteForm2').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevenir el comportamiento por defecto del formulario
  
  // Capturar el formulario para obtener los datos
  const formData = new FormData(this);  // Primero, obtener los datos del formulario
  
  // Obtener el ID del paciente
  const pacienteId = formData.get('id-2');  // ID del paciente
  
  // Validar que el ID esté presente
  if (!pacienteId) {
    alert('El ID del paciente no puede estar vacío');
    return;  // No enviar la solicitud si el ID está vacío
  }

  // Construir el objeto de datos del paciente
  const paciente = {
    id: pacienteId,
    datosPersonales: {
      nombre: formData.get('nombre2'),
      edad: formData.get('edad2')
    },
    familiares: Array.from(document.querySelectorAll('#familiaresContainer2 .familiar')).map(familiar => ({
      nombre: familiar.querySelector('[name="familiarNombre2[]"]').value,
      parentesco: familiar.querySelector('[name="parentesco2[]"]').value,
      edad: familiar.querySelector('[name="familiarEdad2[]"]').value
    })),
    condicionesPreexistentes: Array.from(document.querySelectorAll('#condicionesContainer2 .condicion')).map(condicion => ({
      enfermedad: condicion.querySelector('[name="enfermedad2[]"]').value,
      tiempo: condicion.querySelector('[name="tiempo2[]"]').value,
      detalle: condicion.querySelector('[name="detalle2[]"]').value
    })),
    internamientos: Array.from(document.querySelectorAll('#internamientosContainer2 .internamiento')).map(internamiento => ({
      fecha: internamiento.querySelector('[name="fecha2[]"]').value,
      centroMedico: internamiento.querySelector('[name="centroMedico2[]"]').value,
      diagnostico: internamiento.querySelector('[name="diagnostico2[]"]').value
    }))
  };

  // Hacer la solicitud PUT con el ID
  fetch(`http://localhost:5000/api/pacientes/${pacienteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paciente)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del servidor:', data);
    document.getElementById('pacienteForm2').reset();
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('validarPaciente').addEventListener('click', function () {
    const pacienteId = document.getElementById('id-paciente3').value.trim();
  
    if (!pacienteId) {
      alert('Por favor, ingrese el ID del paciente');
      return;
    }
  
    // Hacer la solicitud GET para obtener los datos del paciente
    fetch(`http://localhost:5000/api/pacientes/${pacienteId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Paciente no encontrado');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('nombre3').value = data.datosPersonales.nombre;
        document.getElementById('edad3').value = data.datosPersonales.edad;
      })
      .catch(error => {
        console.error('Error:', error);
        alert('No se encontró el paciente con el ID ingresado');
        document.getElementById('nombre3').value = '';
        document.getElementById('edad3').value = '';
      });
  });
  
  // Función para eliminar paciente
  document.getElementById('validarPaciente').addEventListener('click', () => {
    const pacienteId = document.getElementById('id-paciente3').value.trim();

    if (!pacienteId) {
        alert('Por favor, ingrese un ID de paciente válido.');
        return;
    }

    fetch(`http://localhost:5000/api/pacientes/${pacienteId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
                return;
            }

            // Llenar los campos con la información del paciente
            document.getElementById('nombre3').value = data.datosPersonales.nombre;
            document.getElementById('edad3').value = data.datosPersonales.edad;
        })
        .catch(error => {
            console.error('Error al validar paciente:', error);
            alert('Hubo un problema al validar el paciente.');
        });
});

document.getElementById('eliminarPacienteBtn').addEventListener('click', () => {
    const pacienteId = document.getElementById('id-paciente3').value.trim();

    if (!pacienteId) {
        alert('Por favor, ingrese un ID de paciente válido.');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
        return;
    }

    fetch(`http://localhost:5000/api/pacientes/${pacienteId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Paciente eliminado con éxito.');
            document.getElementById('formulario-eliminar').reset();
        }
    })
    .catch(error => {
        console.error('Error al eliminar paciente:', error);
        alert('Hubo un problema al eliminar el paciente.');
    });
});
