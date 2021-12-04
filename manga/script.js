document.body.style.opacity = "0%";
let json1, episodes = "",
    title = "",
    episodeCountId = document.getElementById("episodeCount"),
    date = document.getElementById("date"),
    loadAnime = (url) => {
        fetch(url)
            .then(response => {
                return response.json()
            }).then(json => {
                json1 = json;
                //ep or movie#
                switch (json.data[0].attributes.titles.en) {
                    case undefined:
                    case null:
                        switch (json.data[0].attributes.titles.en_jp) {
                            case undefined:
                            case null:
                                switch (json.data[0].attributes.titles.en_us) {
                                    case undefined:
                                    case null:
                                        title = json.data[0].attributes.titles.ja_jp;
                                        break;
                                    default:
                                        title = json.data[0].attributes.titles.en_us;
                                        break;
                                }
                                break;
                            default:
                                title = json.data[0].attributes.titles.en_jp
                                break;
                        }
                        break;
                    default:
                        console.log(json.data[0].attributes.titles.en)
                        title = json.data[0].attributes.titles.en
                        break;
                }
                // bloody rating thing
                document.getElementById("ratingContainer").innerHTML = `
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>`;
                let rating = (json.data[0].attributes.averageRating / 10) / 2;
                document.getElementById("ratingNumber").innerHTML = rating.toFixed(1);
                for (i = 1; i <= document.getElementsByClassName("fa fa-star checked").length; i++) {
                    let a = document.getElementsByClassName("fa fa-star checked")[i - 1];
                    a.setAttribute('class', "fa fa-star")
                }
                for (i = 1; i <= Math.floor((json.data[0].attributes.averageRating / 10) / 2); i++) {
                    let a = document.getElementsByClassName("fa fa-star")[i - 1]
                    a.setAttribute('class', "fa fa-star checked")
                }
                document.getElementById("title").innerHTML = title
                switch (json.data[0].attributes.endDate) {
                    case null:
                        date.innerHTML = json.data[0].attributes.startDate.replace(/-/g, "/") + " - now";
                        break;
                    default:
                        date.innerHTML = json.data[0].attributes.startDate.replace(/-/g, "/") + " - " +
                            json.data[0].attributes.endDate.replace(/-/g, "/");
                }
                switch (json.data[0].attributes.chapterCount) {
                    case null:
                        document.getElementById("chapters").innerHTML = "Chapters: ?";
                        break;
                    default:
                        document.getElementById("chapters").innerHTML = `Chapters: ${json.data[0].attributes.chapterCount}`;
                }
                switch (json.data[0].attributes.volumeCount) {
                    case null:
                    case 0:
                        document.getElementById("volumes").innerHTML = "Volumes: ?";
                        break;
                    default:
                        document.getElementById("volumes").innerHTML = `Volumes: ${json.data[0].attributes.volumeCount}`;
                }
                document.getElementById("manType").innerHTML = json.data[0].attributes.mangaType.charAt(0).toUpperCase() + json.data[0].attributes.mangaType.slice(1);
                document.getElementById("description").innerHTML = json.data[0].attributes.description;

                document.body.style.opacity = "100%";
                try {
                    document.getElementById("posterImg").src = json.data[0].attributes.posterImage.large;
                    document.getElementById("coverImg").src = json.data[0].attributes.coverImage.large;
                } catch { null }
                return json
            }).then(json => {
                try {
                    let backgroundColorPalette, colorThief = new ColorThief(),
                        img = document.querySelector('#posterImg');
                    img.crossOrigin = 'anonymous';
                    switch (img.complete) {
                        case true:
                            backgroundColorPalette = colorThief.getPalette(img, 5);
                            document.getElementById("content").style.backgroundImage = gradient;
                            break;
                        default:
                            img.addEventListener('load', function() {
                                backgroundColorPalette = colorThief.getPalette(img, 5);
                                let gradient = `linear-gradient(to bottom right,
                                rgb(${backgroundColorPalette[0][0]},${backgroundColorPalette[0][1]},${backgroundColorPalette[0][2]})0%,
                                rgb(${backgroundColorPalette[1][0]},${backgroundColorPalette[1][1]},${backgroundColorPalette[1][2]})10%,
                                rgb(${backgroundColorPalette[2][0]},${backgroundColorPalette[2][1]},${backgroundColorPalette[2][2]})20%,
                                rgb(${backgroundColorPalette[3][0]},${backgroundColorPalette[3][1]},${backgroundColorPalette[3][2]})70%,
                                rgb(${backgroundColorPalette[4][0]},${backgroundColorPalette[4][1]},${backgroundColorPalette[4][2]})100%
                                )`;
                                document.body.style.backgroundImage = gradient;
                            });
                            break;
                    }
                } catch {
                    let backgroundColorPalette, colorThief = new ColorThief(),
                        img = document.querySelector('#posterImg');
                    img.crossOrigin = 'anonymous';
                    switch (img.complete) {
                        case true:
                            backgroundColorPalette = colorThief.getPalette(img, 5);
                            break;
                        default:
                            img.addEventListener('load', function() {
                                backgroundColorPalette = colorThief.getPalette(img, 5);
                            });
                            break;
                    }
                    let gradient = `linear-gradient(to bottom right,
                    rgb(${backgroundColorPalette[0][0]},${backgroundColorPalette[0][1]},${backgroundColorPalette[0][2]})0%,
                    rgb(${backgroundColorPalette[1][0]},${backgroundColorPalette[1][1]},${backgroundColorPalette[1][2]})10%,
                    rgb(${backgroundColorPalette[2][0]},${backgroundColorPalette[2][1]},${backgroundColorPalette[2][2]})20%,
                    rgb(${backgroundColorPalette[3][0]},${backgroundColorPalette[3][1]},${backgroundColorPalette[3][2]})70%,
                    rgb(${backgroundColorPalette[4][0]},${backgroundColorPalette[4][1]},${backgroundColorPalette[4][2]})100%
                    )`;
                    document.body.style.backgroundImage = "";
                    document.body.style.backgroundImage = gradient;
                    document.body.style.backgroundImage = gradient;
                }

            })
    }

loadAnime("https://kitsu.io/api/edge/manga?filter[text]=hunter x hunter");
document.getElementById("searchButton").addEventListener("click", () => {
    loadAnime("https://kitsu.io/api/edge/manga?filter[text]=" + document.getElementById("search").value)
})
document.getElementById("search").addEventListener("keypress", (e) => {
    e.key == "Enter" ? loadAnime("https://kitsu.io/api/edge/manga?filter[text]=" + document.getElementById("search").value) : null;
})