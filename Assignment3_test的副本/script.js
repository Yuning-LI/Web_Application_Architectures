var apikey = '1fb1910a726f7a9cce1d3efa4ae25779';
var currentMovieId;
var wrongMessageShowing = false;
var body = document.body;

function getMovieInfoById (movieId){
    var Http = new XMLHttpRequest();
    var url = 'https://api.themoviedb.org/3/movie/' +movieId+ '?api_key=' +apikey;
    Http.open('GET', url);
    Http.send();
    Http.onreadystatechange = function (e){
        if (this.readyState == 4 && this.status == 200) {
            var respondJson = JSON.parse(Http.responseText);
            currentMovieId = respondJson.id;
            var result = {
                id: respondJson.id,
                name: respondJson.original_title,
                date: respondJson.release_date,
                image: 'https://image.tmdb.org/t/p/w500'+respondJson.poster_path
            };
            var movieTitle = document.getElementsByClassName('movie_title');
            var movieImage = document.getElementsByClassName('movie_image');
            var movieDate = document.getElementsByClassName('movie_date');
            movieTitle[movieTitle.length-1].innerHTML = result.name;
            movieImage[movieImage.length-1].setAttribute('src', result.image);
            movieDate[movieDate.length-1].innerHTML = result.date;
        }
    }
}

function init (){
    //https://api.themoviedb.org/3/movie/550?api_key=1fb1910a726f7a9cce1d3efa4ae25779
    //https://image.tmdb.org/t/p/w500/8kNruSfhk5IoE4eZOc4UpvDn6tq.jpg image path
    //https://api.themoviedb.org/3/search/movie?api_key=###&query=the+avengers search movie by name
    //https://api.themoviedb.org/3/search/person?api_key=###&query=Brad+Pitt detail of a person
    //https://api.themoviedb.org/3/person/287/movie_credits?api_key=1fb1910a726f7a9cce1d3efa4ae25779 sb's casts
    var initMovieId = 550;
    getMovieInfoById(initMovieId);
    var submitButton = document.getElementsByClassName('submit_answer')[0];
    submitButton.onclick = function(e){
        e = e || window.event
        submitAnswer(e);
    }
}


addEventListener('load', () => {
    init();
})

function submitAnswer (e){
    var input = document.getElementsByClassName('user_answer')[0];
    var answerPerson = input.value.split(' ').join('+');
    var Http = new XMLHttpRequest();
    var url = 'https://api.themoviedb.org/3/search/person?api_key='+apikey+'&query='+answerPerson;
    
    Http.open('GET', url);
    Http.send();
    Http.onreadystatechange = function (e){
        if (this.readyState == 4 && this.status == 200) {
            var respondJson = JSON.parse(Http.responseText);
            var worklist = respondJson.results[0].known_for;
            var personInfo = {
                id: respondJson.results[0].id,
                name: respondJson.results[0].name,
                image: 'https://image.tmdb.org/t/p/w500' + respondJson.results[0].profile_path
            };
            for (var i = 0; i < worklist.length; i++) {
                if (worklist[i].id == currentMovieId) {
                    hideWrongMessage();
                    makePersonInfo(personInfo);
                    makeQuizForm('movie', worklist);
                    return;
                }
            }
            showWrongMessage();
        }
    }
}

function makePersonInfo (personInfo){
    var newPersonInfoDiv = document.getElementsByClassName('personinfo')[0].cloneNode(true);
    newPersonInfoDiv.style.display = 'inline';
    newPersonInfoDiv.firstElementChild.innerHTML = personInfo.name;
    newPersonInfoDiv.lastElementChild.setAttribute('src', personInfo.image);
    body.appendChild(newPersonInfoDiv);
}

function makeMovieInfo (movieId){
    var newMovieInfoDiv = document.getElementsByClassName('movieinfo')[0].cloneNode(true);
    newMovieInfoDiv.style.display = 'inline';
    body.appendChild(newMovieInfoDiv);
    getMovieInfoById(movieId);
}

function makeQuizForm (type, para){ // type = person or movie
    var newQuizForm = document.getElementsByClassName('quizform')[0].cloneNode(true);
    body.append(newQuizForm);
    newQuizForm.firstElementChild.value = '';
    if (type == 'person') {
        newQuizForm.children[0].setAttribute('placeholder', 'Enter director/actor');
        newQuizForm.children[1].onclick = function(e){
            e = e || window.event;
            var input = e.currentTarget.previousElementSibling.value;

            //showWrongMessage();
        }
    } else if (type == 'movie') {
        newQuizForm.children[0].setAttribute('placeholder', 'Enter his/her movie');
        newQuizForm.children[1].onclick = function(e){
            e = e || window.event;
            var input = e.currentTarget.previousElementSibling.value;
            for(var i = 0; i < para.length; i++){
                if(para[i].title == input){
                    var movieId = para[i].id;
                    hideWrongMessage();
                    makeMovieInfo(movieId);
                    makeQuizForm('person');
                    return;
                }
            }
            showWrongMessage();
        }
    }
}

function showWrongMessage (){
    var wrongMessage = document.getElementsByClassName('wrong_message');
    wrongMessage[wrongMessage.length-1].style.display = 'inline';
    wrongMessageShowing = true;
}

function hideWrongMessage (){
    var wrongMessage = document.getElementsByClassName('wrong_message');
    wrongMessage[wrongMessage.length-1].style.display = 'none';
    wrongMessageShowing = false;
}



