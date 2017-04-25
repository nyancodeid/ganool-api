# Ganool-API
Ganool API with NodeJS Server. Only Support Get List of Movie

## Using
Clone this Repository with
`git clone https://github.com/nyancodeid/ganool-api.git`

Run
`npm install`

Start Node
`npm start`

You will see 
`Ganool-API Run in Port 8081`

Open your Browser and goto to 
`http://localhost:8081/get?url=(URL Ganool)`

## Example Result Page
```json
[{
    "title": "Rings (2017) BluRay 720p 900MB Goody.to",
    "poster": "https://goody.to/wp-content/uploads/2017/04/Rings-2017-Bluray-258x323.jpg?v=1",
    "quality": "BluRay 720p",
    "detail": {
        "imdbRating": "4.5/10",
        "releaseDate": " 2017-02-01",
        "duration": " 102",
        "size": "900MB",
        "language": "English"
    },
    "country": "Country: United States of America",
    "actors": ["Aimee Teegarden", "Alex Roe", "Andrea Laing", "Bonnie Morgan", "Johnny Galecki", "Laura Wiggins", "Matilda Anna Ingrid Lutz", "Surely Alvelo", "Vincent D'Onofrio", "Zach Roerig"],
    "genre": ["Drama", "Horror"],
    "director": "Diane Durant,F. Javier Gutiérrez,Janine Gosselin",
    "downloads": [{
        "title": "Rockfile.to",
        "link": "https://rockfile.to/file/sudsDLhdvG"
    }, {
        "title": "LinkGen",
        "link": "https://linkgen.st/p/NTk4NzU"
    }],
    "synopsis": "Julia becomes worried about her boyfriend, Holt when he explores the dark urban legend of a mysterious videotape said to kill the watcher seven days after viewing. She sacrifices herself to save her boyfriend and in doing so makes a horrifying discovery: there is a \"movie within the movie\" that no one has ever seen before."
}]
```

## Ganool Website Link
Ganool change they URL everytime
 
- [https://goody.to/](https://goody.to/)

