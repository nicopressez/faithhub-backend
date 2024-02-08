const mongoose = require("mongoose");
const mongoDB = process.env.DATABASE;

function mongoSetup() {

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}
}

module.exports = mongoSetup