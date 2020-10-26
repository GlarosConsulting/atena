import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { addDays, isBefore, parseISO } from 'date-fns';

import { useAuthentication } from '@/hooks/authentication';
import IFilteredTasks from '@/interfaces/tasks/IFilteredTasks';
import ITask from '@/interfaces/tasks/ITask';
import ITaskAlert from '@/interfaces/tasks/ITaskAlert';
import fetch from '@/lib/fetch';
import api from '@/services/api';

type ITasksResponse = IFilteredTasks;

interface ICreateTaskDTO {
  instrument: string;
  date: Date;
  status: string;
  task: string;
  details: string;
}

interface IAddAlertToTaskDTO {
  user_id: string;
  description: string;
}

interface ITasksContextData {
  tasks?: IFilteredTasks;
  createTask(data: ICreateTaskDTO): Promise<ITask>;
  addAlertToTask(
    id: string,
    data: IAddAlertToTaskDTO,
  ): Promise<[ITaskAlert, ITask]>;
}

const TasksContext = createContext<ITasksContextData>({} as ITasksContextData);

const TasksProvider: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthentication();

  if (!isLoggedIn()) {
    return <>{children}</>;
  }

  const [tasks, setTasks] = useState<IFilteredTasks>({
    urgent: [],
    next: [],
  });

  useEffect(() => {
    async function loadTasks() {
      const response = await fetch<ITasksResponse>('/tasks/filtered');

      setTasks(response.data);
    }

    loadTasks();
  }, []);

  const createTask = useCallback(
    async (data: ICreateTaskDTO): Promise<ITask> => {
      const response = await api.post<ITask>('/tasks', data);

      const task = response.data;

      const newTasks = { ...tasks };

      if (isBefore(parseISO(task.date), addDays(Date.now(), 5))) {
        newTasks.urgent.push(task);
      } else {
        newTasks.next.push(task);
      }

      setTasks(newTasks);

      return task;
    },
    [tasks],
  );

  const addAlertToTask = useCallback(
    async (
      id: string,
      data: IAddAlertToTaskDTO,
    ): Promise<[ITaskAlert, ITask]> => {
      let taskIsIn: keyof IFilteredTasks;

      if (tasks.next.some(task => task.id === id)) {
        taskIsIn = 'next';
      } else if (tasks.urgent.some(task => task.id === id)) {
        taskIsIn = 'urgent';
      }

      if (!taskIsIn) return [null, null];

      const response = await api.post<ITaskAlert>(`/tasks/${id}/alerts`, data);

      const findTask = tasks[taskIsIn].find(task => task.id === id);
      const alert = response.data;

      findTask.alerts.push(alert);

      const newTasks = {
        ...tasks,
        [taskIsIn]: [...tasks[taskIsIn].filter(task => task.id !== id)],
      };

      setTasks(newTasks);

      return [alert, findTask];
    },
    [tasks],
  );

  return (
    <TasksContext.Provider value={{ tasks, createTask, addAlertToTask }}>
      {children}
    </TasksContext.Provider>
  );
};

function useTasks(): ITasksContextData {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("'useTasks' must be used within an 'TasksProvider'");
  }

  return context;
}

export { TasksProvider, useTasks };
