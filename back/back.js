import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const apiUrl = 'http://3.87.2.49:3000/pacientes';

async function obtenerPacientes() {
    try {
        const response = await axios.get(apiUrl);
        console.log('Pacientes recibidos:', response.data);
    } catch (error) {
        console.error('Error al obtener pacientes:', error.message);
    }
}

obtenerPacientes(); // ejemplo de uso

app.listen(5000, () => {
    console.log('Servidor Express iniciado solo para consumo interno.');
});
