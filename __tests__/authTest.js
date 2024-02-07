const authRouter = require('../routes/auth')
const setup = require('./testSetup')

const request = require('supertest');
const express = require('express');
const app = express();

setup()
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

// Auth tests ignored until a mock database is set for tests

/*test("Signup route if all fields sent are valid", async function () {
    const payload = {username: "testuser",
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

test("Login route if valid credentials", async function()  {
    const payload = {
        username: "testone",
        password: "password"
    }
    const response = await request(app)
        .post("/login")
        .set('Content-Type', 'application/json') 
        .set('Accept', 'application/json') 
        .send(payload)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/json/);

    
}) */