import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.js';
import areasRoutes from './routes/areas.js';
import turnosRoutes from './routes/turnos.js';
import horariosRoutes from './routes/horarios.js';
import parametrosRoutes from './routes/parametros.js';
import registrosRoutes from './routes/registros.js';
import compensatoriosRoutes from './routes/compensatorios.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/empleados', empleadosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/parametros', parametrosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/compensatorios', compensatoriosRoutes);
app.use('/auth', authRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API de Horas Extra y Compensatorios funcionando ✅');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
