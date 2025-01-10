
export const API_URL = 'http://localhost:3001/api';

export const DEFAULT_PAGE_LIMIT = 20;

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};