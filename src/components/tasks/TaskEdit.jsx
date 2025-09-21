import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TaskForm from './TaskForm'

const TaskEdit = () => {
  const { id } = useParams()
  const isEditMode = !!id


  useEffect(() => {
    document.title = isEditMode ? 'Edit Task - Weid' : 'Create Task - Weid'

    return () => {
      document.title = 'Weid - Task Management'
    }
  }, [isEditMode])

  return (
    <div>
      {/* No duplicated heading here - the TaskForm will handle the heading */}
      <TaskForm taskId={id} />
    </div>
  )
}

export default TaskEdit