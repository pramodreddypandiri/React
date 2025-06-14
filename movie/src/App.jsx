import Search from './assets/components/Search'
import './App.css'
import { useEffect, useState } from 'react'
import MovieCard from './assets/components/MovieCard';
import Spinner from './assets/components/Spinner';
const API_BASE_URL = 'https://api.themoviedb.org/3/discover/movie';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [moiveList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = `${API_BASE_URL}?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      setIsLoading(false)
      if(!response.ok){
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json();

      if (data.Response == 'false'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([])
        return;
      }
      setMovieList(data.results || [])
      console.log(data)
    }catch(error){
      console.log(`Error fetching movies ${error}`)
      setErrorMessage('error fetching movies')
    } finally{
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className='pattern'>
        <div className='wrapper'>
            <header >
              <img src="./hero.png" alt="Hero banner" />
              <h1>Find<span className='text-gradient'>Movies</span> that are worth watching.</h1>
              <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
            </header>
            <section className='all-movies'>
              <h2 className='mt-[40px]'>All Movies</h2>
              { isLoading ? 
              ( <p className='text-white>'> <Spinner/></p>): errorMessage ? (
                <p className='text-red-900>'> {errorMessage}</p> 
              ): (
                <ul>
                  {moiveList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}/>
                  ))}
                </ul>
              )}
            </section>
           
        </div>

      </div>
    </main>
  )
}

export default App
