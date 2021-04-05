const TMDB_API_KEY = 'API_KEY'
const IMAGES_URL = 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2'

//Global variable to prevent too much request i.e store the movie a person made on multiple form submition
let current_person = null
let current_person_movies = null

//Global variable to prevent too much request i.e store the cast of a movie we already looked for on multiple form submition
let current_movie = 'The Intouchables'
let current_movie_cast = null

//To remember the movie we saw
let movie_dict = [current_movie]

//App loader

addEventListener('load', (e) => {
    //Load the app
    //Make a request to tmdb to get first movie
    let container = document.getElementById('container')
    makeRequest("/search/movie?query=" + current_movie + "&").then(data => {
        current_movie = data.results[0]
        container.innerHTML = `
            <div class="movie_information">
            <p>
                <b>Title : </b>${data.results[0].title}<br>
                <b>Release date : </b>${data.results[0].release_date}
            </p>
            <img src="${IMAGES_URL + data.results[0].backdrop_path}"/>
            </div>
            <div class="form_div">
            <form id="form_id" onsubmit="formHandler(this, event)">
                <div>
                    <label for="answer">Director or actors names : </label>
                    <span><input class="" id="answer" type="text"></span>
                </div>
                <span class="error_message"></span>
                <button class="form_div" type="submit">Submit</button>
            </form>
            </div>
        `
    })
})

//Main endpoint for forms here the logic happen

async function formHandler(form, e){
    e.preventDefault()
    console.log(movie_dict)
    let next = null
    let input = form[0].value.toLowerCase().trim()
    if(input == ''){
        form.children[1].textContent = "❌ Input can't be empty 😕 ❌"
        form.children[1].style.visibility = 'visible'
        form.children[1].style.display = 'block'
        return null
    }
    //If we are looking for actor or director info
    if(current_movie){
        //If we have not alredy get the cast members
        if(!current_movie_cast){
            //Get the cast members
            current_movie_cast = await getDirectorAndActor(current_movie.id)                
        }
        //Check if the input is director or actor of the current movie
        for(let i = 0; i < current_movie_cast.directors.length; i++){
            if(input == current_movie_cast.directors[i].name.toLowerCase().trim()){
                next = current_movie_cast.directors[i]
            }
        }
        if(!next){
            for(let i = 0; i < current_movie_cast.actors.length; i++){
                if(input == current_movie_cast.actors[i].name.toLowerCase().trim()){
                    next = current_movie_cast.actors[i]
                }
            }
        }
        //If next undefined, that mean that the user was wrong
        if(!next){
            form.children[1].textContent = "❌ Couldn't find any actor or director matching the input 😕 ❌"
            form.children[1].style.visibility = 'visible'
            form.children[1].style.display = 'block'
        }
        else{
            //Add this person to the DOM and reset gloabl params
            current_movie = null
            current_movie_cast = null
            form[1].disabled = true

            form.children[1].style.visibility = 'hidden'
            form.children[1].style.display = 'none'

            //Current actor director defined in addPersonToGame()
            await addPersonToGame(next.id)
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);                
            }, 100)
        }
    }
    else{
        if(!current_person_movies){
            //Get the movies the actor or directed played in.
            //? More flexibility here
            current_person_movies = await getMovies(current_person.id)
        }
        for(let i = 0; i < current_person_movies.length; i++){
            if(input == current_person_movies[i].title.toLowerCase().trim()){
                next = current_person_movies[i]
            }
        }
        //I will now use the search engine of tmdb because it permit mistyping and french support
        let movie_typed = null
        if(!next){
            movie_typed = await searchMovie(input)
            //If it exist, look for the cast
            if(movie_typed.results[0]){
                let cast = await getDirectorAndActor(movie_typed.results[0].id)
                //Look if he is director
                for(let i = 0; i < cast.directors.length; i++){
                    if(current_person.name == cast.directors[i].name.toLowerCase().trim()){
                        next = movie_typed.results[0]
                    }
                }
                //If still not found look for actor
                if(!next){
                    for(let i = 0; i < cast.actors.length; i++){
                        if(current_person.name == cast.actors[i].name){
                            next = movie_typed.results[0]
                        }
                    }
                }
            }
        }
        if(!next){
            form.children[1].textContent = "❌ Couldn't find any film this person directed or played in matching the input 😕 ❌"
            form.children[1].style.visibility = 'visible'
            form.children[1].style.display = 'block'
        }
        else{
            //Check if the movie has already been submitted
            if(movie_dict.includes(next.title)){
                form.children[1].textContent = "❌ You already use this movie 😅 ❌"
                form.children[1].style.visibility = 'visible'
                form.children[1].style.display = 'block'
                return null
            }
            else{
                movie_dict.push(next.title)
            }
            //Reset global params
            current_person = null
            current_person_movies = null
            form[1].disabled = true

            //Remove error messages
            form.children[1].style.visibility = 'hidden'
            form.children[1].style.display = 'none'

            //Add this movie to the DOM and reset global params
            await addMovieToGame(next.id)
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);                
            }, 100)
        }
    }
}

//Give more flexibility for movie input i.e support both French and English title

function searchMovie(movie_name){
    return new Promise(async (resolve, reject) => {
        makeRequest('/search/movie?query=' + movie_name + '&').then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

//Get movie cast of a movie or movies of a person

function getDirectorAndActor(movie_id){
    return new Promise(async (resolve, reject) => {
        makeRequest("/movie/" + movie_id + "/credits?").then(data => {
            //Let's look for the actors and directors
            let directors = []
            for(let i = 0; i < data.crew.length; i++){
                if(data.crew[i].job == 'Director'){
                    directors.push(data.crew[i])
                }
            }
            resolve({actors: data.cast, directors: directors})
        }).catch(err => {
            reject(err)
        })        
    })
}

function getMovies(person_id){
    return new Promise(async (resolve, reject) => {
        makeRequest("/person/" + person_id + "/movie_credits?").then(data => {
            let movies = []
            for(let i = 0; i < data.cast.length; i++){
                movies.push(data.cast[i])
            }
            for(let i = 0; i < data.crew.length; i++){
                if(data.crew[i].job == 'Director'){
                    movies.push(data.crew[i])
                }
            }
            resolve(movies)
        }).catch(err => {
            reject(err)
        })
    })
}

//Get more information about a movie or person

function getMoviesInformation(movies_id){
    return new Promise(async (resolve, reject) => {
        makeRequest("/movie/" + movies_id + "?").then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function getPersonInformation(person_id){
    return new Promise(async (resolve, reject) => {
        makeRequest("/person/" + person_id + "?").then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

//DOM Interactor => Add div and form to the game

async function addMovieToGame(movie_id){
    let movie_information = await getMoviesInformation(movie_id)

    let container = document.getElementById('container')
    container.innerHTML += `
        <div class="movie_information">
        <p>
            <b>Title : </b>${movie_information.title}<br>
            <b>Release date : </b>${movie_information.release_date}
        </p>
        <img src="${IMAGES_URL + movie_information.backdrop_path}"/>
        </div>
        <div class="form_div">
        <form id="form_id" onsubmit="formHandler(this, event)">
            <div>
                <label for="answer">Director or actors names : </label>
                <span><input class="" id="answer" type="text"></span>
            </div>
            <span class="error_message"></span>
            <button class="form_div" type="submit">Submit</button>
        </form>
        </div>
    `
    current_movie = movie_information
}

async function addPersonToGame(person_id){
    //Get this person information
    let person_information = await getPersonInformation(person_id)
    //Display this person information
    let container = document.getElementById('container')
    container.innerHTML += `
        <div class="movie_information">
        <p>
            <b>Name : </b>${person_information.name}
        </p>
        <img src="${IMAGES_URL + person_information.profile_path}"/>
        </div>
        <div class="form_div">
        <form id="form_id" onsubmit="formHandler(this, event)">
            <div>
                <label for="answer">Movie this person has played or directed in : </label>
                <span><input class="" id="answer" type="text"></span>
            </div>
            <span class="error_message"></span>
            <button class="form_div" type="submit">Submit</button>
        </form>
        </div>
    `
    current_person = person_information
}

//Basic request function

function makeRequest(request){
    return new Promise((resolve, reject) => {
        let url = "https://api.themoviedb.org/3" + request + "api_key=" + TMDB_API_KEY + "&language=en-US"
        fetch(url).then((res) => {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })        
    })
}