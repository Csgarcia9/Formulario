import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const archivoDatos = './datos.json';

// Función para leer el archivo JSON
function leerPacientes(callback) {
    fs.readFile(archivoDatos, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        try {
            const pacientes = JSON.parse(data).pacientes || [];
            callback(null, pacientes);
        } catch (error) {
            callback(error);
        }
    });
}

// Función para escribir en el archivo JSON
function escribirPacientes(pacientes, callback) {
    const data = { pacientes: pacientes };
    fs.writeFile(archivoDatos, JSON.stringify(data, null, 2), callback);
}

// Ruta para obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    leerPacientes((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }
        res.json({ pacientes: pacientes });
    });
});

// Ruta para obtener un paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
    const pacienteId = req.params.id; // Obtiene el ID del paciente desde la URL
    
    leerPacientes((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }
        
        // Busca el paciente con el ID proporcionado
        const paciente = pacientes.find(p => p.id === pacienteId);
        
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }
        
        res.json(paciente);
    });
});

app.post('/api/pacientes', (req, res) => {
    const nuevoPaciente = req.body; // Datos del paciente a agregar

    leerPacientes((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }

        // Asegúrate de agregar un ID único (puedes usar la longitud del array o alguna librería para generar IDs)

        pacientes.push(nuevoPaciente); // Agrega el nuevo paciente al array

        escribirPacientes(pacientes, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo.' });
            }
            res.status(201).json({ message: 'Paciente agregado con éxito.', paciente: nuevoPaciente });
        });
    });
});

// Ruta para agregar o actualizar un paciente
app.put('/api/pacientes/:id', (req, res) => {
    const pacienteId = req.params.id; // ID del paciente
    const pacienteActualizado = req.body; // Datos del paciente a actualizar

    leerPacientes((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }

        const indicePaciente = pacientes.findIndex(paciente => paciente.id === pacienteId);

        if (indicePaciente === -1) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        pacientes[indicePaciente] = pacienteActualizado;

        escribirPacientes(pacientes, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo.' });
            }
            res.json({ message: 'Paciente actualizado con éxito.' });
        });
    });
});

// Ruta para eliminar un paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const pacienteId = req.params.id;

    leerPacientes((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo.' });
        }

        const indicePaciente = pacientes.findIndex(paciente => paciente.id === pacienteId);

        if (indicePaciente === -1) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        // Elimina el paciente
        pacientes.splice(indicePaciente, 1);

        escribirPacientes(pacientes, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo.' });
            }
            res.json({ message: 'Paciente eliminado con éxito.' });
        });
    });
});

app.listen(5000, () => console.log('Servidor en el puerto 5000'));


