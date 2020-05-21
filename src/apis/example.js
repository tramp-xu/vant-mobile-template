import http from '@/utils/http';

export const _searchArticle = (data) => {
  return http.get('/api/article/search', data);
};

