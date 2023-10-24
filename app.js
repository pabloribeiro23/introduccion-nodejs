const express = require("express"); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html
const fs = require("fs");

const app = express(); // Crea una instancia de ExpressJS

const port = 3000;

app.use(express.json()); // Permite que el servidor analice el cuerpo de las peticiones como JSON

const people = require("./json/people.json"); // Importa los datos iniciales (generados en https://www.mockaroo.com/)

app.get("/", (req, res) => {
  // El primer parámetro SIEMPRE es asociado a la request (petición) y el segundo a la response (respuesta)
  res.send("<h1>Bienvenid@ al servidor</h1>");
});

app.get("/people", (req, res) => {
  res.json(people); // Enviamos todo el array
});

app.get("/people/:index", (req, res) => {
  /*La propiedad "params" del request permite acceder a los parámetros de la URL 
    (importante no confundir con la "query", que serían los parámetros que se colocan 
    luego del signo "?" en la URL)
   */
  res.json(people[req.params.index]); // Enviamos el elemento solicitado por su índice
});

app.post("/people", (req, res) => {
  /* La propiedad "body" del request permite acceder a los datos 
       que se encuentran en el cuerpo de la petición */

  people.push(req.body); // Añadimos un nuevo elemento al array

  res.json(req.body); // Le respondemos al cliente el objeto añadido
});

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.put("/people/:index", (req, res) => {
  const path = "./json/people.json"; //dirección del archivo
  let index = req.params.index; //almacenar index de la url
  let newData = req.body; //almacenar los datos que vienen en el body de la request

  fs.readFile(path, 'utf-8', function(errorRead, data) { //leer un archivo con fs (file system module de node) => (dirección, modo de decodificación, función)
    if (errorRead){
      console.error(errorRead);
      console.log('Algo salió mal');
      res.status(500).send('Error en la lectura del archivo'); //error 500 => Internal server error
      return;
    }

    const people = JSON.parse(data); //La data que nos devuelve readFile está en formato json - necesario parsear

    if (index >= 0 && index < people.length){ //verificar la existencia del index
      people[index] = newData; //actualización de datos

      fs.writeFile(path, JSON.stringify(people), function(errorWrite) { //sobreescribir un archivo con fs => (dirección, contenido, función)
        if(errorWrite) {
          console.error(errorWrite);
          console.log('Error al escribir el archivo');
          res.status(500).send('Error al escribir en el archivo')
        } else {
          console.log('¡Reemplazado!');
          res.json(newData);
        }
      })
    } else {
      console.log('Índice fuera de rango');
      res.status(400).send('Índice fuera de rango'); //error 400 => bad request
    }
  })
})


app.delete("/people/:index", (req, res) => {
  const path = "./json/people.json"; //dirección del archivo
  let index = req.params.index; //almacenar index de la url

  fs.readFile(path, 'utf-8', function(errorRead, data){
    if (errorRead) {
      console.error(errorRead);
      console.log('Algo salió mal');
      res.status(500).send('Error en la lectura del archivo');
      return;
    }

    const people = JSON.parse(data);
    if(index >= 0 && index < people.length){
      people.splice(index, 1);

      fs.writeFile(path, JSON.stringify(people), function(errorWrite) {
        if(errorWrite){
          console.error(errorWrite);
          console.log('Error al escribir en el archivo');
          res.status(500).send('Error al escribir en el archivo');
        } else{
          console.log('Eliminado con éxito');
          res.json(people)
        }
      })
    } else {
      console.log('Índice fuera de rango');
      res.status(400).send('Índice fuera de rango');
    }
  })
});

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

