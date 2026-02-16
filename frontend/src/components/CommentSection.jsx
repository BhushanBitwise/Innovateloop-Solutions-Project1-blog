import { useEffect, useState, useContext } from "react";
import API from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ postId, postAuthorId, showInCard = false, maxDisplay = 2 }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !name) {
      toast.error("All fields required");
      return;
    }

    try {
      await API.post(`/comments/${postId}`, { text, name });
      toast.success("Comment added");
      setText("");
      setName("");
      fetchComments();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      fetchComments();
    } catch {
      toast.error("Only post owner can delete");
    }
  };

  // Function to get random pastel color based on name (with error handling)
  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-green-400 to-green-500',
      'from-pink-400 to-pink-500',
      'from-indigo-400 to-indigo-500',
      'from-teal-400 to-teal-500',
      'from-rose-400 to-rose-500',
      'from-amber-400 to-amber-500',
    ];
    
    // Default color if name is undefined or empty
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return colors[0]; // Return first color as default
    }
    
    // Use name to pick consistent color
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Function to get initial with fallback
  const getInitial = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '?';
    }
    return name.charAt(0).toUpperCase();
  };

  const displayedComments = showInCard && !showAllComments 
    ? comments.slice(0, maxDisplay) 
    : comments;

  const remainingCount = comments.length - maxDisplay;

  return (
    <div className={`${showInCard ? 'mt-4 pt-4 border-t border-slate-100' : 'mt-10'}`}>
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftIcon className="w-5 h-5 text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-700">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {!showInCard && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all duration-200 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            rows="3"
            placeholder="Write your comment..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all duration-200 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-xl italic">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-3">
          {displayedComments.map((comment) => {
            // Safely access comment properties with fallbacks
            const commentName = comment?.name || 'Anonymous';
            const commentText = comment?.text || '';
            const commentDate = comment?.createdAt ? new Date(comment.createdAt) : new Date();
            
            return (
              <div
                key={comment?._id || Math.random()}
                className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar with gradient background based on name */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarColor(commentName)}
                      flex items-center justify-center text-white text-sm font-semibold shadow-sm
                    `}>
                      {getInitial(commentName)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800 text-sm">
                          {commentName}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">
                          {commentDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {commentText}
                      </p>
                    </div>
                  </div>

                  {user?._id === postAuthorId && comment?._id && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-50 rounded-lg"
                      title="Delete comment"
                    >
                      <TrashIcon className="w-4 h-4 text-red-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {showInCard && remainingCount > 0 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-blue-500 hover:text-slate-700 font-medium text-sm mt-2 flex items-center gap-1"
            >
              <span>View {remainingCount} more comment{remainingCount > 1 ? 's' : ''}</span>
              <span>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;