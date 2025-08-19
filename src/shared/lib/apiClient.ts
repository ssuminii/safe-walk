import axios, { type CreateAxiosDefaults } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
};

export const apiClient = axios.create(baseConfig);


