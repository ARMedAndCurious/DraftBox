import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Send, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">Draft</span>;
    case 'PENDING_REVIEW':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700">Pending Review</span>;
    case 'PUBLISHED':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-900/50 text-green-300 border border-green-700">Published</span>;
    case 'REJECTED':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-900/50 text-red-300 border border-red-700">Rejected</span>;
    default:
      return null;
  }
};

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyArticles = async () => {
    try {
      const response = await api.get('/api/articles/mine');
      setArticles(response.data);
    } catch (err) {
      console.error("Failed to fetch my articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const handleSubmitReview = async (id) => {
    try {
      setError('');
      await api.patch(`/api/articles/${id}/submit`);
      fetchMyArticles(); // Refresh list
    } catch (err) {
      setError(err.response?.data || 'Failed to submit for review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary">
        <Clock className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">My Articles</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-gray-800">
          <p className="text-gray-400">You haven't written any articles yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <div key={article.id} className="bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity"></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white pr-4">{article.title}</h2>
                  <StatusBadge status={article.status} />
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                  {article.content}
                </p>
              </div>
              
              {article.status === 'DRAFT' && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => handleSubmitReview(article.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticles;
