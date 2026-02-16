import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/axios";
import CommentSection from "../components/CommentSection";
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-slate-500 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span className="font-medium">{post.author?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700 mb-12">
          {post.content}
        </div>

        <CommentSection
          postId={post._id}
          postAuthorId={post.author?._id}
        />
      </div>
    </article>
  );
};

export default PostDetails;