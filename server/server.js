const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const date = new Date();
const newData = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "dist")));

const env = process.env.env || "prod";

const data_file_path = path.join(__dirname, "data.json");
const api_file_path = path.join(__dirname, "api.json");
const data = fs.readFileSync(data_file_path, "utf-8");
const api = fs.readFileSync(api_file_path, "utf-8");
const jsonData = JSON.parse(data);
const jsonDataAPI = JSON.parse(api);

app.get("/api/v1/getdata", function (req, res) {
  console.log(jsonData);
  res.json(jsonData);
});

app.post("/api/v1/postdata", function (req, res) {
  const body = req.body;
  console.log(body);
  try {
    jsonData.push(body);
    fs.writeFileSync(data_file_path, JSON.stringify(jsonData, null, 2));
    res.status(201).send({ message: "created" });
  } catch (postDataError) {
    console.error(postDataError);
  }
});

app.post("/api/v1/api", function (req, res) {
  const body = req.body;
  console.log(body);
  try {
    while (jsonDataAPI.length > 0) {
      console.log("I am here");
      jsonDataAPI.pop();
    }
    jsonDataAPI.push(body);
    fs.writeFileSync(api_file_path, JSON.stringify(jsonDataAPI, null, 2));
    res.status(200).send({ message: "added" });
  } catch (postDataError) {
    console.error(postDataError);
  }
});

app.get("/api/v1/getapikey", function (req, res) {
  console.log(jsonDataAPI);
  res.json(jsonDataAPI);
});

if (env === "prod") {
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(2001, function () {
  console.log("deployed");
});
