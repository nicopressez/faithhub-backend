const authRouter = require('../routes/auth')
const setup = require('./testSetup')

const request = require('supertest');
const express = require('express');
const app = express();

setup()
app.use(express.urlencoded({ extended: false }));

app.use("/", authRouter)

test("Testing if route works", done => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect({message: "success"})
      .expect(200,done)
})