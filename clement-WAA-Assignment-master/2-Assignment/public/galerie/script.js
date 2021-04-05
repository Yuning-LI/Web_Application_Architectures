const BASE_URL = 'http://localhost:3000/'

//App loader
//Just calling the api to get database data about the images
addEventListener('load', () => {
    getData().then(images => {
        for(let i = 0; i < images.length && i < 10; i++){
            let date = new Date(images[i].timestamp)
            let date_str = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            document.getElementById('container').innerHTML += `
            <div>
                <p>Made with ❤ by : ${images[i].author}</p>
                <p>Published on : ${date_str}</p>
                <img class="image" onclick="openImage(this)" src="${BASE_URL + images[i].image}"/>
            </div>
            `
        }
    }).catch(error => {
        console.log(error)
    })
})

function getData(){
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + 'get_images',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })     
    })
}

function openImage(image){
    window.open().document.write('<img src="' + image.src + '"/>')
}