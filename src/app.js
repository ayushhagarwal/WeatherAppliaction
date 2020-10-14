const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode=require('./utils/geocode');
const forecast=require('./utils/forecast');

const app = express();
const port=process.env.PORT || 3000;

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and view loaction
app.set("view engine", "hbs"); // to setup handlebars
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//set up static directory to  serve
app.use(express.static(publicDirectoryPath)); // This runs for root URL
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Ayush",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is a help text",
    title: "Help",
    name: "Ayush",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    name: "Ayush",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
    if(error){
      return res.send({error});
    }
    forecast(latitude,longitude,(error,forecastData)=>{
      if(error){
        return res.send({error});
      }
      res.send({
        forecast:forecastData,
        location,
        address:req.query.address
      })
    })
  })
});
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

// below is used to start the server
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ayush",
    errorMessage: "Help Article Not Found",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ayush",
    errorMessage: "Page Not Found",
  });
});

app.listen(port, () => {
  console.log("Server is up and running on port!"+port);
});
