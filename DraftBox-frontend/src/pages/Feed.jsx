import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock } from 'lucide-react';

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error("Failed to fetch feed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary">
        <Clock className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-10">
        Latest Articles
      </h1>
      
      {articles.length === 0 ? (
        <div className="text-center py-10 bg-dark-surface rounded-xl border border-gray-800">
          <p className="text-gray-400">No published articles yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-dark-surface p-6 rounded-xl shadow-md border border-gray-800 hover:border-gray-700 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-2">{article.title}</h2>
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <span>By {article.author?.username}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {article.content?.substring(0, 200)}
                {article.content?.length > 200 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
