## Ascoldata

Ascoldata is a website that grants users access to information and statistics about their Spotify's listening history.  
It also features relevant information about songs, albums, artists and playlists and even allows for requesting song recommendations,
based on various attributes, using the [Spotify API](https://developer.spotify.com/documentation/web-api/).  
On an artist's page there is a link to it's Wikipedia page, if found, using the [Wikipedia API](https://en.wikipedia.org/w/api.php).  
On a song page there is a link to the Genius lyrics page, if found, using the [Genius API](https://genius.com/developers).  

**Ascoldata is in no way affiliated with neither Spotify, Wikipedia nor Genius.**

### Technology

This project is built with React and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
For making calls to the Spotify API it uses the [spotify-web-api-js](https://github.com/JMPerez/spotify-web-api-js) package, and
for the Wikipedia API the [wikijs](https://github.com/dijs/wiki) package.  
For dealing with the Spotify's OAuth authentication cycle and token refreshing it uses [Firebase Functions](https://firebase.google.com/products/functions/),
however the code is contained in another repository for security reasons.  
The website is currently being hosted on [Netlify](https://www.netlify.com).

### Contacts

To report bugs or request features for the website you can open an issue on this repository.  
Alternatively you can send an email to [ascoldata@gmail.com](mailto:ascoldata@gmail.com).

<p align="center">
  <img width="150" height="150" src="https://github.com/TitoGrine/Ascoldata/blob/master/src/assets/images/logo.svg">
</p>
