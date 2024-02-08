const profileRouter = require('../routes/profile')
const setup = require('./testSetup')
const initializeMongoServer = require('./mongoSetup');
const User = require('../models/user');
const bcrypt = require("bcryptjs")
const express = require('express');
const app = express();
const router = express.Router();


const request = require('supertest');
const profileController = require('../controllers/profileController');

// Call setups
setup();
initializeMongoServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Overwrite routes so it doesn't check tokens
app.patch('/:id/update', profileController.profile_update);
app.delete('/:id/delete', profileController.profile_delete);

// Set route
app.use("/profile", profileRouter)

// Fill database before tests
beforeEach( async() => {
    const hashedPassword = await bcrypt.hash("password", 10);

    const testuser = new User({
        username: "testuserdb",
        first_name: "John",
        last_name: "Doe",
        password: hashedPassword,
        location: "paris"
})
    await testuser.save()
})
  afterEach( async() => {
        await User.deleteOne({username:"testuserdb"});
  });

  // Tests

  test("Return user info on get route (no token check)", async () => {
    const testuser = await User.findOne({username: "testuserdb"})
    const testuserid = testuser._id
    const response = await request(app)
        .get(`/profile/${testuserid}`)

      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.user.username).toEqual("testuserdb");

  })

  test("Update user info (no token check)", async() => {
    const testuser = await User.findOne({username: "testuserdb"})
    const testuserid = testuser._id
    const payload = {username: "edited",
                     first_name: "John",
                     last_name: "Doe",
                     location: "paris"}

    const response = await request(app)
    .patch(`/${testuserid}/update`)
    .send(payload)
    expect(response.status).toBe(200)
  })

  test("Delete user info (no token check)", async() => {
    const testuser = await User.findOne({username: "testuserdb"})
    const testuserid = testuser._id

    const response = await request(app)
    .delete(`/${testuserid}/delete`)
    expect(response.status).toBe(200)
  })