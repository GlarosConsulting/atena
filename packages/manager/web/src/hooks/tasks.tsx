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

interface ITasksContextData {
  tasks?: IFilteredTasks;
  createTask(data: ICreateTaskDTO): Promise<void>;
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

  const createTask = useCallback(async (data: ICreateTaskDTO) => {
    const response = await api.post<ITask>('/tasks', data);

    const task = response.data;

    const newTasks = { ...tasks };

    if (isBefore(parseISO(task.date), addDays(Date.now(), 5))) {
      newTasks.urgent.push(task);
    } else {
      newTasks.next.push(task);
    }

    setTasks(newTasks);
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, createTask }}>
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
