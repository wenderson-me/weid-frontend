import React, { useState } from 'react';
import { FiPaperclip, FiX, FiSend } from 'react-icons/fi';
import commentService from '../../services/commentService';

const CommentForm = ({ taskId, initialValue = '', commentId, parentComment, onSuccess, onCancel }) => {
  const [content, setContent] = useState(initialValue);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let response;

      if (commentId) {
        response = await commentService.updateComment(commentId, {
          content,
          attachments
        });
      } else {
        response = await commentService.createComment({
          content,
          task: taskId,
          parentComment: parentComment || undefined,
          attachments
        });
      }

      setContent('');
      setAttachments([]);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    setAttachments([...attachments, ...fileNames]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-2 rounded-md mb-2 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <textarea
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pr-24 resize-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          placeholder={commentId ? "Edit your comment..." : parentComment ? "Write a reply..." : "Write a comment..."}
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        ></textarea>

        <div className="absolute bottom-3 right-3 flex space-x-2">
          <label className="cursor-pointer text-gray-500 hover:text-violet-600 p-1 rounded">
            <FiPaperclip className="h-5 w-5" />
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            className="text-white bg-violet-600 hover:bg-violet-700 p-1 rounded"
            disabled={isSubmitting || !content.trim()}
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1 flex items-center"
            >
              <span className="truncate max-w-xs">{attachment}</span>
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-red-500"
                onClick={() => removeAttachment(index)}
              >
                <FiX className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cancel button (only in edit mode or when provided) */}
      {(commentId || onCancel) && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 text-sm px-3 py-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default CommentForm;