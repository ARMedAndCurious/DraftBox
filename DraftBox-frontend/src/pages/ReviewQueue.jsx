import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const ReviewQueue = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingArticles = async () => {
    try {
      const response = await api.get('/api/articles/pending');
      setArticles(response.data);
    } catch (err) {
      console.error("Failed to fetch pending articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const handlePublish = async (id) => {
    try {
      await api.patch(`/api/articles/${id}/publish`);
      fetchPendingArticles();
    } catch (err) {
      console.error("Failed to publish", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/api/articles/${id}/reject`);
      fetchPendingArticles();
    } catch (err) {
      console.error("Failed to reject", err);
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
      <h1 className="text-3xl font-extrabold text-white mb-8">Review Queue</h1>
      
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-gray-800">
          <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">All caught up! No articles pending review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-dark-surface p-6 rounded-xl shadow-lg border border-gray-800 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{article.title}</h2>
                  <p className="text-sm text-primary font-medium">By {article.author?.username}</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={() => handleReject(article.id)}
                    className="inline-flex items-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/30 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handlePublish(article.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-500 transition-colors shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mt-4 border border-gray-800">
                <p className="text-gray-300 whitespace-pre-wrap">{article.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
