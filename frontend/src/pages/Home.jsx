import { useEffect, useState } from "react";
import API from "../services/axios";
import PostCard from "../components/PostCard";
import { BookOpenIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(3); // Initially show 3 posts
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    API.get("/posts")
      .then((res) => {
        setPosts(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisiblePosts(prev => prev + 3); // Load 3 more posts
      setLoadingMore(false);
    }, 500);
  };

  const hasMorePosts = visiblePosts < posts.length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
          Blogs that <span className="text-slate-900">matter</span>
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Discover articles from passionate writers
        </p>
        
        <div className="mt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all shadow-sm hover:shadow"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Start Writing
          </Link>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <BookOpenIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">No stories yet</p>
          <p className="text-slate-400 text-sm">Be the first to write!</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {posts.slice(0, visiblePosts).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="text-center mt-4 mb-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all border border-blue-600 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-slate-800"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Stories
                    <span className="text-slate-400 text-sm">({posts.length - visiblePosts} remaining)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Posts Count */}
          <div className="text-center text-sm text-slate-400">
            Showing {visiblePosts} of {posts.length} stories
          </div>
        </>
      )}
    </div>
  );
};

export default Home;