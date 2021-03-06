const express = require('express');
const methodOverride = require('method-override');
const { indexOf } = require('./models/pokemon.js');
const app = express();
const port = 3000;

///////////////////////
// MODELS
///////////////////////
let pokemons = require("./models/pokemon.js");

///////////////////////
// MIDDLEWARE
///////////////////////
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(methodOverride('_method'));


///////////////////////
// ROUTES
///////////////////////

// Index
// GET /pokemon
app.get('/pokemon', (req, res)=>{

    // Subset array
    const subset = [];

    // Get 20 Random Pokemon
    for(let i = 0; i < 20; i ++){
        subset.push(pokemons[Math.floor(Math.random()*pokemons.length)])
    }
    res.render('pokedex_index.ejs', {'randomPokemon':subset, 'featured':getFeatured()})
})


// New
// GET /pokemon/new
app.get('/pokemon/new', (req, res)=>{
    res.render('pokedex_new.ejs', {'featured':getFeatured()})
})

// Create
// POST /pokemon
app.post('/pokemon', (req, res)=>{
    console.log(req.body);
    const newID = 1+(+pokemons[pokemons.length-1].id);

    const newPokemon = {'id': String(newID),
        name: req.body.name,
        img: req.body.url, 
        type: [req.body.type1, req.body.type2],
        stats: {
            hp: String(req.body.hp),
            attack: String(req.body.attack),
            defense: String(req.body.defense)},
        };
        pokemons.push(newPokemon);
    res.redirect('/pokemon/'+newID);
})
// Edit
// GET /pokemon/:id/edit
app.get('/pokemon/:id/edit', (req, res)=>{
    let pokemon = pokemons.find(o => o.id === req.params.id)
    res.render('pokedex_edit.ejs', {'pokemon': pokemon, 'featured':getFeatured()})
})

// Update
// PUT /pokemon/:id
app.put('/pokemon/:id', (req, res)=>{
    console.log(req.body)
    const pokemon = pokemons.find(o => o.id === req.params.id);
    const body = req.body;
    pokemon.name = body.name;
    pokemon.img = body.url;
    pokemon.stats.hp = body.hp;
    pokemon.stats.attack = body.attack;
    pokemon.stats.defense = body.defense;
    res.redirect('/pokemon/' + req.params.id)
})
// Destroy
// DELETE /pokemon/:id
app.delete('/pokemon/:id', (req, res)=>{
    const indexToDelete = pokemons.indexOf(pokemons.find(o => o.id === req.params.id));
    pokemons.splice(indexToDelete, 1)
    res.redirect('/pokemon')
})

// Show
// GET /pokemon/:id
app.get('/pokemon/:id', (req, res)=>{
    let pokemon = pokemons.find(o => o.id === req.params.id)
    res.render('pokedex_show.ejs', {'pokemon': pokemon, 'featured':getFeatured()})
})

///////////////////////
// LISTENERS
///////////////////////
app.listen(port, (req, res)=>{
    console.log("Hello Seattle, I'm listening on port " + port);
})

function getFeatured(){ 
    // Random Pokemon ID
    const date = new Date();
    const dateString = date.getYear().toString() + date.getMonth().toString() + + date.getDate().toString();
    featuredIndex = +dateString%pokemons.length+1;
    return featuredIndex;
}