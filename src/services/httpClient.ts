import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { MovieResponse, Movie } from '../models/Movie';

const httpClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = 'https://api.themoviedb.org/3';

httpClient.interceptors.request.use((config) => {

  if (config.params) {
    config.params = { ...config.params, api_key: TMDB_API_KEY };
  } else {
    config.params = { api_key: TMDB_API_KEY };
  }
  
  if (!config.url?.startsWith('http')) {
    config.url = `${BASE_URL}${config.url}`;
  }
  
  return config;
});


const parseEndpoint = (endpoint: string): { path: string; queryParams: Record<string, string> } => {

  if (!endpoint.includes('?')) {
    return { path: endpoint, queryParams: {} };
  }

  const [path, queryString] = endpoint.split('?');
  

  const queryParams = Object.fromEntries(
    queryString.split('&').map(param => {
      const [key, value] = param.split('=');
      return [key, value];
    })
  );
  
  return { path, queryParams };
};


export const getMoviesByEndpoint = async (endpoint: string, page = 1): Promise<MovieResponse> => {
  const { path, queryParams } = parseEndpoint(endpoint);

  const response = await httpClient.get(path, {
    params: {
      ...queryParams,
      page,
    },
  });
  
  return response.data;
};


export const fetchMovieById = async (movieId: string): Promise<Movie> => {
  try {
    const response = await httpClient.get(`/movie/${movieId}`, {
      params: {
        language: 'en-US'
      }
    });
    
    const data = response.data;

    const movie: Movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      genre_ids: data.genres ? data.genres.map((genre: any) => genre.id) : [],
    };
    
    return movie;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};


export default httpClient;
