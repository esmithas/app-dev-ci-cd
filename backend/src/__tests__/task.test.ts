import request from 'supertest';
import app from '../app'; // Asegúrate de que app se exporta desde app.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Tasks API', () => {
  beforeAll(async () => {
    // Limpia la base de datos antes de todas las pruebas
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    // Desconecta Prisma después de todas las pruebas
    await prisma.$disconnect();
  });

  it('should return an empty array of tasks initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test description.',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Test Task');
    expect(res.body.completed).toEqual(false);
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toEqual('Test Task');
  });

  it('should update a task', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task to Update', description: 'Desc.' });
    const taskId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: 'Updated Task', completed: true });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.title).toEqual('Updated Task');
    expect(updateRes.body.completed).toEqual(true);
  });

  it('should delete a task', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task to Delete', description: 'Desc.' });
    const taskId = createRes.body.id;

    const deleteRes = await request(app).delete(`/tasks/${taskId}`);
    expect(deleteRes.statusCode).toEqual(204);

    const getRes = await request(app).get('/tasks');
    expect(getRes.body.find((task: any) => task.id === taskId)).toBeUndefined();
  });
}); 