const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    let category = req.body.category;

    let url = "https://v2.jokeapi.dev/joke/" + category;

    https.get(url, (response) => {
        let rawData = "";
    
        // Collect data chunks
        response.on("data", (chunk) => {
            rawData += chunk;
        });
    
        response.on("end", () => {
            const jokeData = JSON.parse(rawData);
            if (jokeData.type === "single") {
                let joke = jokeData.joke;
                res.render("singleJoke", { joke: joke })
            } else {
                let setup = jokeData.setup;
                let delivery = jokeData.delivery;
                res.render("twoPartjoke", { setup: setup, delivery: delivery })
            }
        })
    })
})

app.post("/again", (req, res)=>{
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`https://localhost:${port}`)
})
