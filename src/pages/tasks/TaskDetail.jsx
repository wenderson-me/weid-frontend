import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiArchive,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskComments from '../../components/tasks/TaskComments';
import TaskActivities from '../../components/tasks/TaskActivities';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getTaskById, updateTask, deleteTask, archiveTask, restoreTask } = useTasks();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const taskData = await getTaskById(id);

        if (isMounted) {
          setTask(taskData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch task details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTaskData();

    return () => {
      isMounted = false;
    };
  }, [id, getTaskById]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await updateTask(task._id, { status: newStatus });
      setTask(updatedTask);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task._id);
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      let updatedTask;

      if (task.isArchived) {
        updatedTask = await restoreTask(task._id);
      } else {
        updatedTask = await archiveTask(task._id);
      }

      setTask(updatedTask);
    } catch (err) {
      console.error('Failed to toggle archive status:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task || !task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today && task.status !== 'done';
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'inReview', label: 'In Review' },
    { value: 'done', label: 'Done' }
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium">Error Loading Task</h3>
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
        <button
          className="flex items-center text-violet-600 hover:text-violet-800 font-medium"
          onClick={() => navigate('/tasks')}
        >
          <FiArrowLeft className="mr-2" />
          Back to Tasks
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium">Task Not Found</h3>
          <p>The requested task could not be found or you don't have access to it.</p>
        </div>
        <button
          className="flex items-center text-violet-600 hover:text-violet-800 font-medium"
          onClick={() => navigate('/tasks')}
        >
          <FiArrowLeft className="mr-2" />
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <button
            className="mr-4 text-gray-500 hover:text-violet-600"
            onClick={() => navigate('/tasks')}
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
        </div>

        <div className="flex space-x-2">
          <button
            className="px-3 py-1.5 text-gray-600 hover:text-violet-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md flex items-center"
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            <FiEdit className="h-4 w-4 mr-1" />
            Edit
          </button>

          <button
            className="px-3 py-1.5 text-gray-600 hover:text-violet-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md flex items-center"
            onClick={handleArchiveToggle}
          >
            {task.isArchived ? (
              <>
                <FiRefreshCw className="h-4 w-4 mr-1" />
                Restore
              </>
            ) : (
              <>
                <FiArchive className="h-4 w-4 mr-1" />
                Archive
              </>
            )}
          </button>

          <button
            className="px-3 py-1.5 text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-gray-200 rounded-md flex items-center"
            onClick={openDeleteModal}
          >
            <FiTrash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {task.description || <span className="text-gray-400 italic">No description provided</span>}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right text-sm text-gray-500">
                    {task.progress}% Complete
                  </div>
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {task.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 border border-gray-200 rounded"
                        >
                          <div className="flex-1 truncate">{attachment}</div>
                          <button className="text-violet-600 hover:text-violet-800 ml-2">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <TaskComments taskId={id} />
            </TabsContent>

            <TabsContent value="activities">
              <TaskActivities taskId={id} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>

            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Current Status
              </label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="flex items-center">
                <FiCalendar className={`mr-1 ${isOverdue() ? 'text-red-500' : 'text-gray-500'}`} />
                <span className={`text-sm ${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                  {formatDate(task.dueDate)}
                  {isOverdue() && (
                    <span className="ml-2 flex items-center text-red-600">
                      <FiAlertCircle className="mr-1" /> Overdue
                    </span>
                  )}
                </span>
              </div>
            </div>

            {task.estimatedHours && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Hours
                </label>
                <div className="flex items-center">
                  <FiClock className="mr-1 text-gray-500" />
                  <span>{task.estimatedHours} hours</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">People</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner
              </label>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium mr-2">
                  {task.owner?.name?.charAt(0) || 'U'}
                </div>
                <span>{task.owner?.name || 'Unknown'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignees ({task.assignees?.length || 0})
              </label>
              {task.assignees && task.assignees.length > 0 ? (
                <div className="space-y-2">
                  {task.assignees.map((assignee, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium mr-2">
                        {assignee.name?.charAt(0) || 'U'}
                      </div>
                      <span>{assignee.name || 'Unknown User'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No assignees yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={task.title}
        itemType="task"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TaskDetail;