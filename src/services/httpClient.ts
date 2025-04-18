import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { MovieResponse } from '../models/Movie';


const httpClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const BASE_URL = 'https://api.themoviedb.org/3';

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

export default httpClient;
