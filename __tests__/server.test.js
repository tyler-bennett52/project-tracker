'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db } = require('../src/models')
const mockRequest = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe ('Auth API server',  () => {
  const adminUser = {username: 'admin', password: 'password', role: 'admin'};
  const justAUser = {username: 'user', password: 'user'};
  const { username, password } = justAUser;

  it('Should 404 for a bad route', async () => {
    let response = await mockRequest.get('/apples');
    expect(response.status).toBe(404)
  });

  it('Should 500 for a bad request', async () => {
    let response = await mockRequest.post('/signup').send({stuff: 'this is wrong'});
    expect(response.status).toBe(500)
  });

  it('Can sign up a new user', async () => {
    // const userObject = { username: 'username', password: 'password' }
    let response = await mockRequest.post('/signup').send(justAUser);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    expect(response.status).toBe(201)
    expect(parsedResponse.user.username).toBe('user')
  });

  it('Can sign in an old user', async () => {
    let response = await mockRequest.post('/signin').auth(username, password);
    let parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.user.username).toBe('user')
    expect(response.status).toBe(200)
  });

  it('Grants access to /secret with a bearer token', async () => {
    let response = await mockRequest.post('/signin').auth(username, password);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    let secretResponse = await mockRequest.get('/secret').set('Authorization', `Bearer ${userToken}`);
    expect(secretResponse.text).toBe('Welcome to the secret area')
  });

  it('Allows creating on api/v2/:model with Token', async () => {
    let response = await mockRequest.post('/signup').send(adminUser);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    let secretResponse = await mockRequest
    .post('/api/v2/clothes')
    .send({name: 'pants', color: 'blue', size: 'large'})
    .set('Authorization', `Bearer ${userToken}`)
    let parsedSecret = JSON.parse(secretResponse.text);
    expect(parsedSecret.color).toBe('blue');
  });

  it('Allows users to getAll from /:model', async () => {
    let response = await mockRequest.post('/signin').auth(username, password);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    let secretResponse = await mockRequest.get('/api/v2/clothes').set('Authorization', `Bearer ${userToken}`);
    expect(secretResponse.body.length).toBe(1)
  });

  it('Allows users to getOne from /:model', async () => {
    let response = await mockRequest.post('/signin').auth(username, password);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    let secretResponse = await mockRequest.get('/api/v2/clothes/1').set('Authorization', `Bearer ${userToken}`);
    expect(secretResponse.body.id).toBe(1)
  });

  it('Allows updating on api/v2/:model with Token', async () => {
    let response = await mockRequest.post('/signin').auth(adminUser.username, adminUser.password);
    let parsedResponse = JSON.parse(response.text);
    const userToken = parsedResponse.token
    let secretResponse = await mockRequest
    .put('/api/v2/clothes/1')
    .send({name: 'pants', color: 'green', size: 'large'})
    .set('Authorization', `Bearer ${userToken}`)
    let parsedSecret = JSON.parse(secretResponse.text);
    expect(parsedSecret.color).toBe('green');
  });

    it('Denies access to wrong Roles', async () => {
      let response = await mockRequest.post('/signin').auth(username, password);
      let parsedResponse = JSON.parse(response.text);
      const userToken = parsedResponse.token
      let secretResponse = await mockRequest
      .put('/api/v2/clothes/1')
      .send({name: 'pants', color: 'green', size: 'small'})
      .set('Authorization', `Bearer ${userToken}`)
      let parsedSecret = JSON.parse(secretResponse.text);
      expect(parsedSecret.message).toBe('Access Denied');
    });

    it('Allows admin to delete', async () => {
      let response = await mockRequest.post('/signin').auth(adminUser.username, adminUser.password);
      let parsedResponse = JSON.parse(response.text);
      const userToken = parsedResponse.token
      let secretResponse = await mockRequest
      .delete('/api/v2/clothes/1')
      .set('Authorization', `Bearer ${userToken}`)
      let parsedSecret = JSON.parse(secretResponse.text);
      expect(parsedSecret).toBe(1);
    });

    it('Can CRUD to v1 with no credentials', async () => {
      await mockRequest.post('/api/v1/food').send({name: 'Pizza', calories: 200, type: 'protein'});
      await mockRequest.post('/api/v1/food').send({name: 'Cheese', calories: 200, type: 'protein'});
      await mockRequest.post('/api/v1/food').send({name: 'Lettuce', calories: 200, type: 'protein'});
      await mockRequest.put('/api/v1/food/3').send({name: 'Sauce', calories: 200, type: 'protein'});
      await mockRequest.delete('/api/v1/food/3')
      let response = await mockRequest.get('/api/v1/food');
      let response2 = await mockRequest.get('/api/v1/food/2');
      expect(response.body.length).toBe(2)
      expect(response2.body.id).toBe(2);
    });
});