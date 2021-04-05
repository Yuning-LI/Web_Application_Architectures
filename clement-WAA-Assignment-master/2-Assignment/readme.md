# Assignment 2 👨‍🏫

This assignment also start from the [whiteboard](https://github.com/Tnemlec/Whiteboard) app but here we want to be able to save the image in order to make a gallery page !

We achieve this by first, connecting our server app to a mongo database and store each image on our server. The images are saved in ./public/images/*timestamp*.png so that we can be pretty confident that no images will be saved with the same name 😅.

In the gallery webpage we simply call the server api to get all the images information we need to display those to the user !

## What changed 😮🤔 ?

 - A whole new galerie folder 📁
 - In the script.js JavaScript 👨‍💻:
   - Function to send image data to the api
   - Little improvement on user message (Image send feedback)
 - In the server.js JavaScript 👨‍💻:
   - New REST endpoints to receive and send data to the browser

## What do we store in our database ?

We store the username of the artist 🎨, the date 📅 and the path to the image on the server.

--- 

## How to test ? 😱

You can try this app here 👉 https://tnemlec-waa-2.herokuapp.com/

## How to run ? 🤔

If you want to try this assignment yourself you must first create a mongodb database and get the connection string. 👨‍💻

Download this folder 📂 and create .env file that is following the .env.example file by simply putting your connection string.

Finally you can install the node_modules by taping:
    
    npm install

and start the server with this command:

    node server.js

👈 [Go back to main readme](https://github.com/Tnemlec/WAA-Assignment)