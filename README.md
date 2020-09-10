## Ascoldata

Ascoldata is a website that allows users to get access to information and statistics about their Spotify's listening history.  
Using a set of attributes it's possible to request song recommendations and save them on to a playlist.  
It also features relevant information about songs, albums, artists and playlists that exist on Spotify.  
On an artist's page there is a link to it's Wikipedia page, if found, using the Wikipedia API.  
On a song page there is a link to the Genius lyrics page, if found, using the Genius API.  
Explore your favourite songs and artists and maybe discover some interesting patterns in your listening habits.  

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
