const profileRouter = require('../routes/profile')
const setup = require('./testSetup')
const initializeMongoServer = require('./mongoSetup');
const User = require('../models/user');
const bcrypt = require("bcryptjs")

const request = require('supertest');
const express = require('express');
const user = require('../models/user');
const app = express();

// Call setups
setup();
initializeMongoServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", profileRouter)

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

  test("Return user info on get route", async () => {
    const testuser = await User.findOne({username: "testuserdb"})
    const testuserid = testuser._id
    const response = await request(app)
        .get(`/${testuserid}`)

      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.user.username).toEqual("testuserdb");

  })