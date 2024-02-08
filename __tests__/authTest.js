const authRouter = require('../routes/auth')
const setup = require('./testSetup')
const initializeMongoServer = require('./mongoSetup');
const User = require('../models/user');
const bcrypt = require("bcryptjs")

const request = require('supertest');
const express = require('express');
const app = express();

// Call setups
setup();
initializeMongoServer();

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", authRouter)

test("Testing if route works", done => {
     request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect({message: "success"})
      .expect(200,done)
})


test("Signup route if all fields sent are valid", async function () {
    const payload = {username: "testusered",
                     first_name: "John",
                     last_name: "Doe",
                     password: "password",
                     password_verif: "password",
                     location: "paris"}
    const response = await request(app)
        .post("/signup")
        .send(payload)
        expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toMatch(/json/);


})  

test("Signup route gets back 401 if incorrect password", async function () {
    const payload = {username: "testusered",
                     first_name: "John",
                     last_name: "Doe",
                     password: "password",
                     password_verif: "incorrect",
                     location: "paris"}
    const response = await request(app)
        .post("/signup")
        .send(payload)
        expect(response.status).toBe(401)
      expect(response.headers["content-type"]).toMatch(/json/);

})  

 /* test("Login route if valid credentials", async function()  {
    const payload = {
        username: "testuserdb",
        password: "password"
    }
    const response = await request(app)
        .post("/login")
        .send(payload)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/json/);

    
})  */