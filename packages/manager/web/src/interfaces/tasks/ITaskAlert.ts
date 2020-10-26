export default interface ITaskAlert {
  id: string;
  task_id: string;
  user_id?: string;
  date: string;
  description: string;
}
