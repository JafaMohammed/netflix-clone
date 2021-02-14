import axios from './axios'
import React, { useEffect, useState } from 'react'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = 'https://image.tmdb.org/t/p/original/'

function Row({ title, fetchUrl, isLargeRow }) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('')
    //A snipet of code runs based on a specific condition

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl)

            setMovies(request.data.results)
            return request
        }
        fetchData()
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoPlay: 1
        }
    }

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('')
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    //gets the param v=link video from youtube
                    // https://www.youtube.com/watch?v=movideId
                    const urlParams = new URLSearchParams(new URL(url).search)
                    setTrailerUrl(urlParams.get('v'))
                })
                .catch((err) => console.log(err))
        }
    }

    //console.table(movies);
    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
