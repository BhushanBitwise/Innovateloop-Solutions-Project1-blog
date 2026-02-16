import { Link } from "react-router-dom";
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import CommentSection from "./CommentSection";
import { useState } from "react";

const PostCard = ({ post }) => {
  const [showAllComments, setShowAllComments] = useState(false);

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
      <div className="p-6">
        <Link to={`/post/${post._id}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-3 hover:gradient-text transition-colors">
            {post.title}
          </h2>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        <p className="text-slate-600 mb-4 line-clamp-2">
          {post.content}
        </p>

        <Link 
          to={`/post/${post._id}`}
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
        >
          Read More →
        </Link>

        {/* Comments Section Inside Card */}
        <CommentSection 
          postId={post._id} 
          postAuthorId={post.author?._id} 
          showInCard={true}
          maxDisplay={2}
        />
      </div>
    </article>
  );
};

export default PostCard;