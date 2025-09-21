import React, { useState, useEffect } from 'react';
import {
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiThumbsUp,
  FiCornerDownRight,
  FiMoreVertical
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import commentService from '../../services/commentService';

const CommentItem = ({ comment, onUpdate, onDelete, onReply, taskId }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.some(like => like._id === currentUser?._id || like === currentUser?._id)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = currentUser?._id === (comment.author?._id || comment.author);

  const handleLikeToggle = async () => {
    try {
      const updatedComment = await commentService.toggleLike(comment._id);
      setIsLiked(!isLiked);
      onUpdate(updatedComment);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.deleteComment(comment._id);
        onDelete(comment._id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      {isEditing ? (
        <CommentForm
          taskId={taskId}
          commentId={comment._id}
          initialValue={comment.content}
          onSuccess={(updatedComment) => {
            onUpdate(updatedComment);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium mr-3 flex-shrink-0">
              {comment.author?.name?.charAt(0) || 'U'}
            </div>

            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h4 className="font-medium text-gray-900 mr-2">
                  {comment.author?.name || 'Unknown User'}
                </h4>
                <span className="text-xs text-gray-500" title={formatDate(comment.createdAt)}>
                  {formatDate(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500 ml-2">(edited)</span>
                )}
              </div>

              <div className="text-gray-700">
                {comment.content}
              </div>

              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {comment.attachments.map((attachment, idx) => (
                    <div key={idx} className="bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
                      {attachment.split('/').pop()}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center text-sm">
                <button
                  className={`flex items-center mr-4 ${isLiked ? 'text-violet-600' : 'text-gray-500'} hover:text-violet-600`}
                  onClick={handleLikeToggle}
                >
                  <FiThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes?.length || 0}</span>
                </button>

                <button
                  className="flex items-center mr-4 text-gray-500 hover:text-violet-600"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  <FiCornerDownRight className="h-4 w-4 mr-1" />
                  <span>Reply</span>
                </button>

                {isAuthor && (
                  <div className="relative ml-auto">
                    <button
                      className="flex items-center text-gray-500 hover:text-violet-600"
                      onClick={() => setShowOptions(!showOptions)}
                    >
                      <FiMoreVertical className="h-4 w-4" />
                    </button>

                    {showOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setShowOptions(false);
                            setIsEditing(true);
                          }}
                        >
                          <FiEdit className="h-4 w-4 inline mr-2" />
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setShowOptions(false);
                            handleDelete();
                          }}
                        >
                          <FiTrash2 className="h-4 w-4 inline mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {showReplyForm && (
            <div className="ml-11 mt-3">
              <CommentForm
                taskId={taskId}
                parentComment={comment._id}
                onSuccess={(newComment) => {
                  setShowReplyForm(false);
                  onReply(newComment);
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-11 mt-3 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  taskId={taskId}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async (pageNum = 1) => {
    if (!taskId) return;

    setLoading(true);
    try {
      const response = await commentService.getTaskComments(taskId, {
        page: pageNum,
        limit: 10,
        parentComment: null
      });

      if (response.comments) {
        setComments(pageNum === 1 ? response.comments : [...comments, ...response.comments]);
        setTotalPages(response.pages || 1);
        setHasMore(pageNum < (response.pages || 1));
      } else if (Array.isArray(response)) {
        setComments(pageNum === 1 ? response : [...comments, ...response]);
        setHasMore(false);
      }

      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreate = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment._id !== commentId)
    );
  };

  const handleCommentReply = (newReply) => {
    if (!newReply.parentComment) {
      setComments(prevComments => [newReply, ...prevComments]);
      return;
    }

    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment._id === newReply.parentComment) {
          const updatedReplies = comment.replies ? [...comment.replies, newReply] : [newReply];
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );
  };

  const handleLoadMore = () => {
    if (hasMore) {
      fetchComments(page + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FiMessageSquare className="mr-2 h-5 w-5 text-violet-600" />
          Comments
        </h3>
      </div>

      <div className="p-4">
        <CommentForm
          taskId={taskId}
          onSuccess={handleCommentCreate}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
            <button
              className="ml-2 text-red-700 font-medium underline"
              onClick={() => fetchComments()}
            >
              Try again
            </button>
          </div>
        )}

        {loading && comments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                taskId={taskId}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
                onReply={handleCommentReply}
              />
            ))}

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  className="text-violet-600 hover:text-violet-800 font-medium text-sm"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more comments'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskComments;