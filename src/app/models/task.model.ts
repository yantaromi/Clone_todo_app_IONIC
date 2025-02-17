export interface Task {
    id: number;
    title: string;
    completed: boolean;
    subTasks?: SubTask[];
     // ✅ Ajout de la propriété subTasks (optionnelle)
  }
  
  export interface SubTask {
    id: number;
    title: string;
    completed: boolean;
    showActions?: boolean;
  }