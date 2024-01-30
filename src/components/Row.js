
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = 'https://image.tmdb.org/t/p/original/';

const Row = ({ title, fetchUrl , isLargeRow}) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl , setTrailerUrl] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results); // Assuming the movie data is in the `results` array

        // console.log(request.data.results); // Check the fetched movie data in the console
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    height : "390",
    width : "100%",
    playerVars : {
      autoplay :1,
    },
  };

  const handleClick = (movie) => {
    if(trailerUrl){
      setTrailerUrl('');
    }else{
      movieTrailer(movie?.title || "")
      .then((url) => {
        const youtubeUrl = new URL(url);
        const videoId = youtubeUrl.searchParams.get('v');
        setTrailerUrl(videoId);
      })
      .catch((error) => console.log(error));
    
      // movieTrailer( movie?.name || "")
      // .then((url)=>{
      //   const urlParams = new URLSearchParams(new URL(url).search);
      //   setTrailerUrl(urlParams.get('v'));
      // })
      // .catch((error) => console.log(error));
    }

  }
  return (
    <div className='row'>
      <h2>{title}</h2>

      <div className='row__posters'>
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id} // Remember to assign a unique key when rendering a list of elements
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path }`}
            alt={movie.title}
          />
        ))}
      </div>
      {trailerUrl &&       <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
