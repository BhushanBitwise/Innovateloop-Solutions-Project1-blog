import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/posts/user/me");
      setBlogs(res.data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await API.delete(`/posts/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Error deleting blog");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your published articles</p>
        </div>
        <Link
          to="/create"
          className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Write New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <p className="text-slate-500 text-lg mb-4">You haven't written any blogs yet</p>
          <Link to="/create" className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all inline-flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all p-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{blog.content}</p>
                  <p className="text-xs text-slate-400 mt-3">
                    Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/edit/${blog._id}`}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Edit blog"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete blog"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;