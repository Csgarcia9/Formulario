// Cargar todos los pacientes desde la API externa
fetch('http://3.87.2.49:3000/pacientes')
    .then(response => response.json())
    .then(data => {
        const pacientes = Array.isArray(data) ? data : data.pacientes;
        if (!pacientes) {
            console.error('Respuesta inesperada de la API:', data);
            return;
        }

        const contenedorPacientes = document.getElementById('container-pacientes');

        pacientes.forEach((paciente) => {
            const botonPaciente = document.createElement('button');
            botonPaciente.type = 'button';
            botonPaciente.classList.add('botonesPacientes', 'btn', 'btn-primary');
            botonPaciente.setAttribute('data-bs-toggle', 'modal');
            botonPaciente.setAttribute('data-bs-target', `#modalPaciente${paciente.id}`);
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

            let modalBodyContent = '';

            if (paciente.datosPersonales) {
                modalBodyContent += '<h3>Datos Personales:</h3>';
                modalBodyContent += mostrarDatos(paciente.datosPersonales);
            }

            if (paciente.familiares?.length > 0) {
                modalBodyContent += '<hr><h3>Familiares:</h3>';
                paciente.familiares.forEach((familiar, index) => {
                    modalBodyContent += `<p><strong>Familiar ${index + 1}:</strong></p>`;
                    modalBodyContent += mostrarDatos(familiar, 'familiar_');
                });
            }

            if (paciente.condicionesPreexistentes?.length > 0) {
                modalBodyContent += '<hr><h3>Condiciones Preexistentes:</h3>';
                paciente.condicionesPreexistentes.forEach((condicion, index) => {
                    modalBodyContent += `<p><strong>Condición ${index + 1}:</strong></p>`;
                    modalBodyContent += mostrarDatos(condicion, 'condicion_');
                });
            }

            if (paciente.internamientos?.length > 0) {
                modalBodyContent += '<hr><h3>Internamientos:</h3>';
                paciente.internamientos.forEach((internamiento, index) => {
                    modalBodyContent += `<p><strong>Internamiento ${index + 1}:</strong></p>`;
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
                        <div class="modal-body">${modalBodyContent}</div>
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

// Crear paciente
document.getElementById('pacienteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const paciente = {
        id: formData.get('id'),
        datosPersonales: {
            nombre: formData.get('nombre'),
            edad: formData.get('edad')
        },
        familiares: Array.from(document.querySelectorAll('#familiaresContainer .familiar')).map(f => ({
            nombre: f.querySelector('[name="familiarNombre[]"]').value,
            parentesco: f.querySelector('[name="parentesco[]"]').value,
            edad: f.querySelector('[name="familiarEdad[]"]').value
        })),
        condicionesPreexistentes: Array.from(document.querySelectorAll('#condicionesContainer .condicion')).map(c => ({
            enfermedad: c.querySelector('[name="enfermedad[]"]').value,
            tiempo: c.querySelector('[name="tiempo[]"]').value,
            detalle: c.querySelector('[name="detalle[]"]').value
        })),
        internamientos: Array.from(document.querySelectorAll('#internamientosContainer .internamiento')).map(i => ({
            fecha: i.querySelector('[name="fecha[]"]').value,
            centroMedico: i.querySelector('[name="centroMedico[]"]').value,
            diagnostico: i.querySelector('[name="diagnostico[]"]').value
        }))
    };

    fetch('http://3.87.2.49:3000/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Paciente creado:', data);
        this.reset();
    })
    .catch(error => console.error('Error:', error));
});

// Actualizar paciente
document.getElementById('pacienteForm2').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const pacienteId = formData.get('id-2');

    if (!pacienteId) return alert('El ID del paciente no puede estar vacío');

    const paciente = {
        id: pacienteId,
        datosPersonales: {
            nombre: formData.get('nombre2'),
            edad: formData.get('edad2')
        },
        familiares: Array.from(document.querySelectorAll('#familiaresContainer2 .familiar')).map(f => ({
            nombre: f.querySelector('[name="familiarNombre2[]"]').value,
            parentesco: f.querySelector('[name="parentesco2[]"]').value,
            edad: f.querySelector('[name="familiarEdad2[]"]').value
        })),
        condicionesPreexistentes: Array.from(document.querySelectorAll('#condicionesContainer2 .condicion')).map(c => ({
            enfermedad: c.querySelector('[name="enfermedad2[]"]').value,
            tiempo: c.querySelector('[name="tiempo2[]"]').value,
            detalle: c.querySelector('[name="detalle2[]"]').value
        })),
        internamientos: Array.from(document.querySelectorAll('#internamientosContainer2 .internamiento')).map(i => ({
            fecha: i.querySelector('[name="fecha2[]"]').value,
            centroMedico: i.querySelector('[name="centroMedico2[]"]').value,
            diagnostico: i.querySelector('[name="diagnostico2[]"]').value
        }))
    };

    fetch(`http://3.87.2.49:3000/pacientes/${pacienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Paciente actualizado:', data);
        this.reset();
    })
    .catch(error => console.error('Error:', error));
});

// Eliminar paciente
document.getElementById('eliminarPacienteBtn').addEventListener('click', () => {
    const pacienteId = document.getElementById('id-paciente3').value.trim();

    if (!pacienteId) return alert('Por favor, ingrese un ID válido.');
    if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) return;

    fetch(`http://3.87.2.49:3000/pacientes/${pacienteId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert('Paciente eliminado con éxito.');
        document.getElementById('formulario-eliminar').reset();
    })
    .catch(error => {
        console.error('Error al eliminar paciente:', error);
        alert('Hubo un problema al eliminar el paciente.');
    });
});


// Validar paciente por ID (cargar nombre y edad)
document.getElementById('validarPaciente').addEventListener('click', function () {
    const pacienteId = document.getElementById('id-paciente3').value.trim();

    if (!pacienteId) {
        alert('Por favor, ingrese el ID del paciente');
        return;
    }

    fetch(`http://3.87.2.49:3000/pacientes/${pacienteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Paciente no encontrado');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('nombre3').value = data.datosPersonales?.nombre || '';
            document.getElementById('edad3').value = data.datosPersonales?.edad || '';
        })
        .catch(error => {
            console.error('Error al validar paciente:', error);
            alert('No se encontró el paciente con el ID ingresado');
            document.getElementById('nombre3').value = '';
            document.getElementById('edad3').value = '';
            document.getElementById('id-paciente3').value = '';
        });
});

