const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')

app.use(cors())
app.use(express.json())
//using hemet to secure express
app.use(helmet())

//app.get which will take the api call from front end and activate an api call to the third party api with those details
app.get("/api/search", async (req, res) => {
    //getting the itunes query strings
    const termQuery = req.query.term
    const entityQuery = req.query.entity
    const attQuery = req.query.attribute

    //conditional if statements to handle all possible requests
    if (attQuery != undefined) {
    try {// query strings are placed inside the api call so as to get correct info
    const apiFetch = await fetch(`https://itunes.apple.com/search?term=${termQuery}&entity=${entityQuery}&attribute=${attQuery}&limit=10`)
    const apiData = await apiFetch.json()
    //grabbing only the info i will use from the json objects which are returned
    const arr = await apiData.results.map(result => [result.kind, result.artistName, result.trackName, result.trackPrice])
    res.json(arr)
    } catch (error) {
        res.send(error)
     }
    } 
    else if (entityQuery == 'audiobook'){
    try {
    const apiFetch = await fetch(`https://itunes.apple.com/search?term=${termQuery}&entity=${entityQuery}&limit=10`)
    const apiData = await apiFetch.json()
    const arr = await apiData.results.map(result => [result.wrapperType, result.artistName, result.collectionName, result.collectionPrice])
    res.json(arr)
    } catch (error) {
        res.send(error)
     }
    } 
    else if (entityQuery == 'ebook' || entityQuery == 'software'){
    try {
    const apiFetch = await fetch(`https://itunes.apple.com/search?term=${termQuery}&entity=${entityQuery}&limit=10`)
    const apiData = await apiFetch.json()
    const arr = await apiData.results.map(result => [result.kind,result.artistName, result.trackName, result.formattedPrice])
    res.json(arr)
    } catch (error) {
        res.send(error)
     }
    } else {
    try {
    const apiFetch = await fetch(`https://itunes.apple.com/search?term=${termQuery}&limit=10`)
    const apiData = await apiFetch.json()
    const arr = await apiData.results.map(result =>{
        //if searching without entities and attributes then conditional statement is needed as not all returns have the same objects
        if (result.trackName) {
           return([result.wrapperType, result.artistName, result.trackName, result.trackPrice]) 
        } else if (result.collectionName) {
           return ([result.wrapperType, result.artistName, result.collectionName, result.collectionPrice])
        }})
    res.json(arr)
    } catch (error) {
        res.send(error)
     }
    }
})
//running backend on port 8080
app.listen(8080, function () {
    console.log("running on port 8080")
})