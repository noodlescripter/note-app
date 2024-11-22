const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express();
const cors = require('cors')
const date = new Date();
const newData = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
app.use(express.json())
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')))

const env = process.env.env || 'prod'

const data_file_path = path.join(__dirname, 'data.json');
const data = fs.readFileSync(data_file_path, 'utf-8');
const jsonData = JSON.parse(data);


app.get('/api/v1/getdata', function(req, res){
  console.log(jsonData);
  res.json(jsonData);
})

app.post('/api/v1/postdata', function(req, res){
  const body = req.body;
  console.log(body)
  try {
    jsonData.push(body);
    fs.writeFileSync(data_file_path, JSON.stringify(jsonData, null, 2));
    res.status(201).send({message: "created"})
  } catch (postDataError) {
    console.error(postDataError)
  }
})

if(env === 'prod'){
  app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  })
}

app.listen(2001, function(){
  console.log('deployed')
})