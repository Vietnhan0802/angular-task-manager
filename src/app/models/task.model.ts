// Task Model Interface
export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    dueDate: Date;
    createdAt: Date;
    tags: string[];
}

// Task Statistics Interface
export interface TaskStatistics {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
    completionRate: number;
}

// Filter Options Interface
export interface TaskFilter {
    status?: 'todo' | 'in-progress' | 'completed' | 'all';
    priority?: 'low' | 'medium' | 'high' | 'all';
    search?: string;
}
