const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;


app.get("/", (req, res) => {
  res.render("index"); // <-- usar render con EJS
});

// Middleware
app.use(cors()); // Permitir peticiones desde otros orígenes si es necesario
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jeankevinms2407',
  database: 'hotel_reservas_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL.');
  }
});

// Ruta POST para recibir reservas desde fetch (JS en tu HTML)
app.post('/api/reservas', (req, res) => {
  const {
    nombre,
    correo_electronico,
    fecha_entrada,
    fecha_salida,
    numero_habitaciones,
    comentarios
  } = req.body;

  const sql = `
    INSERT INTO reservas (nombre, correo_electronico, fecha_entrada, fecha_salida, numero_habitaciones, comentarios)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [nombre, correo_electronico, fecha_entrada, fecha_salida, numero_habitaciones, comentarios];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al registrar la reserva:', err);
      return res.status(500).json({ message: 'Error al registrar la reserva.' });
    }

    console.log('✅ Reserva registrada con ID:', result.insertId);
    res.status(200).json({
      message: 'Reserva registrada correctamente.',
      id_reserva: result.insertId
    });
  });
});

// Ruta GET opcional para ver reservas
app.get('/api/reservas', (req, res) => {
  const sql = 'SELECT * FROM reservas ORDER BY fecha_creacion DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener reservas' });
    }
    res.json(results);
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
