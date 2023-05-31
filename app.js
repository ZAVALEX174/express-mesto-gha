const express = require("express");
const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const app = express();

// непонятно, нужно ли:
async function start() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      console.log("Сервер уже запущен...");
    });
  } catch (e) {
    console.log(e);
  }
}

start();
