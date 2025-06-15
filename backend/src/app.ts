import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las peticiones
app.use(cors());

// 1. Endpoint para listar todas las tareas
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Endpoint para crear una nueva tarea
app.post('/tasks', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Endpoint para actualizar una tarea existente
app.put('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        completed,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Endpoint para eliminar una tarea
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 

export default app;