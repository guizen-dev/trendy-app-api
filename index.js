import * as dotenv from 'dotenv'
dotenv.config()

import express, { application, json } from 'express';
import cors from 'cors';
const server = express();
import axios from 'axios'
import { getChart } from 'billboard-top-100'
import * as googleTrends from './controllers/GoogleTrendsControllers.js';
import { pageSpeed } from './controllers/GoogleCloudController.js'
import getFacebookInterests from './controllers/FacebookInterests.js'
import { getTrendingAnimes, getAnimes } from './controllers/AnilistController.js';
import { backlink } from './controllers/BacklinkController.js';
// import { getTrendingTopics } from './controllers/TwitterController.js';
import * as twitter from '@killovsky/trendings'

const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

server.use(cors());
server.use(json());

server.get('/', (req, res) => {
    res.status(200).json("Welcome to the TrendyPro API");
});

// Billboard Top 100 songs
server.get('/billboard-top-100', (req, res) => {

    getChart('hot-100', (err, chart) => {
        if (err) console.log(err);
        res.send(chart.songs);
    });

});

// // Google Trends Area
server.get('/relatedTopics', (req, res) => {
    const word = req.query.keyword
    if (word) {
        googleTrends.getRelatedTopics(word)
            .then(data => res.send(data))
    } else {
        res.sendStatus(400);
    }
});

server.get('/relatedQueries', (req, res) => {
    const word = req.query.keyword
    if (word) {
        googleTrends.getRelatedQueries(word)
            .then(data => res.send(data))
    } else {
        res.sendStatus(400);
    }
});

server.get('/dailyTrends', (req, res) => {
    const { geo } = req.query
    if (geo) {
        googleTrends.getDailyTrends(geo)
            .then(data => res.send(data))
    } else {
        res.sendStatus(400);
    }
});

server.get('/interestOverTime', (req, res) => {
    const { keyword } = req.query

    if (keyword) {
        googleTrends.getInterestOverTime(keyword)
            .then(data => res.send(data))
    } else {
        res.sendStatus(400);
    }
});

// Google Cloud Area

server.get('/pageSpeed', (req, res) => {
    const { url } = req.query
    if (isValidUrl(url)) {
        pageSpeed(url).then(data => {
            res.status(200).json(data)
        })
    } else {
        res.status(400);
    }
});

//Facebook Interests

server.get('/interests', (req, res) => {
    if (req.query.query) {
        const { query } = req.query

        getFacebookInterests(query)
            .then(response => {
                res.send(response)
            }).catch(error => {
                res.send(error);
            });
    } else {
        res.sendStatus(400);
    }
});

// // Entertainment Area

// // Trending Today
server.get("/trendingMovies", (req, res) => {

    axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.MOVIEDBAPIKEY}`)
        .then(function (response) {
            // manipula o sucesso da requisição
            res.send(response.data.results);
        })
        .catch(function (error) {
            // manipula erros da requisição
            console.log(error);
        })
})

server.get("/trendingTV", (req, res) => {
    axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.MOVIEDBAPIKEY}`)
        .then(function (response) {
            // manipula o sucesso da requisição
            res.send(response.data.results);
        })
        .catch(function (error) {
            // manipula erros da requisição
            console.log(error);
        })
})

server.get("/movie/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const movie_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})

server.get("/TV/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const tv_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})


server.get("/moviecredit/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const movie_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})

server.get("/moviekeywords/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const movie_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/keywords?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})

server.get("/tvcredit/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const tv_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/tv/${tv_id}/credits?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})

server.get("/tvkeywords/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const tv_id = req.params.id
        axios.get(`https://api.themoviedb.org/3/tv/${tv_id}/keywords?api_key=${process.env.MOVIEDBAPIKEY}&language=en-US`)
            .then(function (response) {
                // manipula o sucesso da requisição
                res.send(response.data);
            })
            .catch(function (error) {
                // manipula erros da requisição
                console.log(error);
            })
    }
})

// Anilist

server.get("/trendingAnimes", (req, res) => {
    getTrendingAnimes().then((e) => {
        res.json(e.data.Page.media)
    })
        .catch(err => {
            res.status(400).json(err)
        })
})

server.get("/anime/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        getAnimes(req.params.id).then((e) => {
            res.status(200).json(e)
        })
            .catch(err => {
                res.status(400).json(err)
            })
    }
})

server.get("/backlink", (req, res) => {
    const { url } = req.query

    if (isValidUrl(url)) {
        backlink(url).then(data => {
            res.status(200).json(data)
        })
    } else {
        res.status(400).json({ error: "Invalid URL" })
    }


})

server.get("/twitter", (req, res) => {
    const { country } = req.query

    if (country) {
        twitter.info(country)
            .then(data => {
                res.status(200).json(data)
            })
    } else {
        res.status(400).json({ error: "Invalid Country" })
    }
})

let port = process.env.PORT || 3333
server.listen(port, (err) => {
    if (!err) {
        console.log(`Port: ${port}`)
    }
})