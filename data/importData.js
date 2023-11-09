const mongoose=require('mongoose')
const Movie=require('../models/Movie')
const fs=require('fs')

let data=fs.readFileSync('./movies.json','utf-8')
const movies=JSON.parse(data)

mongoose.connect('mongodb://127.0.0.1:27017/movieExpressDB').then(()=>{
    console.log('db connected');
}).catch((err)=>{
    console.log(err);
})

async function importMovies(){
    try {
        await Movie.create(movies)
        console.log('movies imported');
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

async function deleteMovies(){
    try {
        await Movie.deleteMany()
        console.log('movies deleted');
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

if(process.argv[2]==='--import'){
    importMovies()
}

if(process.argv[2]==='--delete'){
    deleteMovies()
}

