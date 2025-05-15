const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Permite conexiones desde otros puertos (útil si usas fetch)
app.use(bodyParser.json()); // Para leer JSON del cuerpo de la petición
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jeankevinms2407', // Cambia si tu contraseña es distinta
  database: 'hotel_reservas_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

// Ruta GET para obtener reservas (opcional)
app.get('/api/reservas', (req, res) => {
  const sql = 'SELECT * FROM reservas ORDER BY fecha_creacion DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener reservas' });
    }
    res.json(results);
  });
});

// Ruta POST para registrar una reserva
app.post('/api/reservas', (req, res) => {
  const { nombre, correo_electronico, fecha_entrada, fecha_salida, numero_habitaciones, comentarios } = req.body;

  const sql = `
    INSERT INTO reservas (nombre, correo_electronico, fecha_entrada, fecha_salida, numero_habitaciones, comentarios)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [nombre, correo_electronico, fecha_entrada, fecha_salida, numero_habitaciones, comentarios];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar reserva:', err.message);
      return res.status(500).json({ message: 'Error al registrar la reserva.' });
    }

    console.log('✅ Reserva insertada con ID:', result.insertId);
    res.status(201).json({ message: 'Reserva registrada correctamente', id_reserva: result.insertId });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
