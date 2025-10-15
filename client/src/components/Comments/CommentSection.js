
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Comment = ({ comment, onVote }) => {
  const [translated, setTranslated] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', {
        text: comment.content.original,
        targetLanguage: 'hi'
      });
      setTranslated(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-avatar">
        {comment.userId?.username?.[0]?.toUpperCase() || '👤'}
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.userId?.username}</span>
          <span className="comment-location">{comment.city}</span>
          <span className="comment-time">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="comment-text">
          {translated || comment.content.original}
        </div>
        <div className="comment-actions">
          <button onClick={() => onVote(comment._id, 'like')}>
            👍 {comment.likes}
          </button>
          <button onClick={() => onVote(comment._id, 'dislike')}>
            👎 {comment.dislikes}
          </button>
          <button onClick={handleTranslate}>
            🌐 Translate
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments/${videoId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Comments fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/comments/${videoId}`, {
        content: newComment
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Comment submit error:', error);
    }
  };

  const handleVote = async (commentId, voteType) => {
    try {
      const response = await axios.post(`/api/comments/vote/${commentId}`, { voteType });

      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, ...response.data }
          : comment
      ));
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>{comments.length} Comments</h3>
      </div>

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button type="submit" className="comment-submit">
          Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
