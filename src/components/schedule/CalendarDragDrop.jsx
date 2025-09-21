import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useTasks } from '../../hooks/useTasks';
import { isTaskOverdue, getStatusBorderClass } from '../../utils/calendarUtils';

/**
 * Wrapper component that adds drag and drop functionality to calendar views
 */
const CalendarDragDrop = ({ children, tasks, onTaskMove }) => {
  const { updateTask } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);


  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );


  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;


    const task = findTaskById(taskId);
    if (task) {
      setActiveTask(task);
      setIsDragging(true);
    }
  };


  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setIsDragging(false);
    setActiveTask(null);


    if (!over || !active) return;


    if (over.data?.current?.type === 'dateCell' && active.data?.current?.type === 'task') {
      const taskId = active.id;
      const targetDate = over.data.current.date;

      if (!targetDate) return;


      let newDueDate;
      const task = findTaskById(taskId);

      if (task && task.dueDate) {
        const oldDate = new Date(task.dueDate);
        newDueDate = new Date(targetDate);

        newDueDate.setHours(
          oldDate.getHours(),
          oldDate.getMinutes(),
          oldDate.getSeconds(),
          oldDate.getMilliseconds()
        );
      } else {
        newDueDate = new Date(targetDate);

        newDueDate.setHours(9, 0, 0, 0);
      }


      try {
        await updateTask(taskId, { dueDate: newDueDate.toISOString() });


        if (onTaskMove) {
          onTaskMove(taskId, newDueDate);
        }
      } catch (error) {
        console.error('Failed to update task due date:', error);
      }
    }
  };


  const findTaskById = (taskId) => {
    if (!tasks || !tasks.length) return null;
    return tasks.find(task => task._id === taskId);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Overlay that shows the task being dragged */}
      <DragOverlay>
        {isDragging && activeTask && (
          <div className="opacity-80 w-48">
            <div className={`px-2 py-1 rounded-lg text-xs bg-white shadow-md border-l-2 ${getStatusBorderClass(activeTask.status)}`}>
              <div className="flex items-center">
                {/* Priority dot */}
                <span className={`h-2 w-2 rounded-full ${
                  activeTask.priority === 'low' ? 'bg-gray-400' :
                  activeTask.priority === 'medium' ? 'bg-blue-400' :
                  activeTask.priority === 'high' ? 'bg-orange-500' :
                  'bg-red-500'
                } mr-1`}></span>

                {/* Title */}
                <span className={`truncate ${isTaskOverdue(activeTask) ? 'text-red-600' : ''}`}>
                  {activeTask.title}
                </span>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default CalendarDragDrop;