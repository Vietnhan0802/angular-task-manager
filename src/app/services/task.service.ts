import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { Task, TaskStatistics, TaskFilter } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // BehaviorSubject for reactive state management
    private tasksSubject = new BehaviorSubject<Task[]>(this.getMockTasks());
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // Public observables
    tasks$ = this.tasksSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    constructor() { }

    // ========== CRUD Operations ==========

    /**
     * Get all tasks
     * Demonstrates: Observable return type, async data fetching simulation
     */
    getTasks(): Observable<Task[]> {
        this.loadingSubject.next(true);
        return this.tasks$.pipe(
            delay(300), // Simulate network delay
            map(tasks => {
                this.loadingSubject.next(false);
                return tasks;
            })
        );
    }

    /**
     * Get task by ID
     * Demonstrates: Observable operators, find operation
     */
    getTaskById(id: number): Observable<Task | undefined> {
        return this.tasks$.pipe(
            map(tasks => tasks.find(task => task.id === id))
        );
    }

    /**
     * Add new task
     * Demonstrates: Immutable state updates, Observable return
     */
    addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
        const currentTasks = this.tasksSubject.getValue();
        const newTask: Task = {
            ...taskData,
            id: this.generateId(),
            createdAt: new Date()
        };

        this.tasksSubject.next([...currentTasks, newTask]);
        return of(newTask).pipe(delay(200));
    }

    /**
     * Update existing task
     * Demonstrates: Array mapping, immutable updates
     */
    updateTask(updatedTask: Task): Observable<Task> {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );

        this.tasksSubject.next(updatedTasks);
        return of(updatedTask).pipe(delay(200));
    }

    /**
     * Delete task
     * Demonstrates: Array filtering, boolean Observable
     */
    deleteTask(id: number): Observable<boolean> {
        const currentTasks = this.tasksSubject.getValue();
        const filteredTasks = currentTasks.filter(task => task.id !== id);

        this.tasksSubject.next(filteredTasks);
        return of(true).pipe(delay(200));
    }

    // ========== Statistics ==========

    /**
     * Get task statistics
     * Demonstrates: Complex data transformation, computed values
     */
    getStatistics(): Observable<TaskStatistics> {
        return this.tasks$.pipe(
            map(tasks => {
                const total = tasks.length;
                const completed = tasks.filter(t => t.status === 'completed').length;
                const inProgress = tasks.filter(t => t.status === 'in-progress').length;
                const todo = tasks.filter(t => t.status === 'todo').length;
                const overdue = tasks.filter(t =>
                    t.status !== 'completed' && new Date(t.dueDate) < new Date()
                ).length;

                return {
                    total,
                    completed,
                    inProgress,
                    todo,
                    overdue,
                    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
                };
            })
        );
    }

    /**
     * Get filtered tasks
     * Demonstrates: Multiple filter conditions, search functionality
     */
    getFilteredTasks(filter: TaskFilter): Observable<Task[]> {
        return this.tasks$.pipe(
            map(tasks => {
                let filtered = [...tasks];

                // Filter by status
                if (filter.status && filter.status !== 'all') {
                    filtered = filtered.filter(t => t.status === filter.status);
                }

                // Filter by priority
                if (filter.priority && filter.priority !== 'all') {
                    filtered = filtered.filter(t => t.priority === filter.priority);
                }

                // Search filter
                if (filter.search && filter.search.trim()) {
                    const searchLower = filter.search.toLowerCase();
                    filtered = filtered.filter(t =>
                        t.title.toLowerCase().includes(searchLower) ||
                        t.description.toLowerCase().includes(searchLower) ||
                        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
                    );
                }

                return filtered;
            })
        );
    }

    /**
     * Toggle task status
     * Demonstrates: Status cycling, quick update
     */
    toggleTaskStatus(id: number): Observable<Task | undefined> {
        const currentTasks = this.tasksSubject.getValue();
        const task = currentTasks.find(t => t.id === id);

        if (task) {
            const statusCycle: { [key: string]: 'todo' | 'in-progress' | 'completed' } = {
                'todo': 'in-progress',
                'in-progress': 'completed',
                'completed': 'todo'
            };

            const updatedTask = { ...task, status: statusCycle[task.status] };
            return this.updateTask(updatedTask);
        }

        return of(undefined);
    }

    // ========== Helper Methods ==========

    private generateId(): number {
        const tasks = this.tasksSubject.getValue();
        return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }

    private getMockTasks(): Task[] {
        const now = new Date();
        return [
            {
                id: 1,
                title: 'Design Dashboard UI',
                description: 'Create wireframes and mockups for the main dashboard interface with statistics cards and charts.',
                priority: 'high',
                status: 'completed',
                dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                tags: ['design', 'ui', 'dashboard']
            },
            {
                id: 2,
                title: 'Implement Authentication',
                description: 'Set up user authentication with JWT tokens and secure login/logout functionality.',
                priority: 'high',
                status: 'in-progress',
                dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
                tags: ['backend', 'security', 'auth']
            },
            {
                id: 3,
                title: 'Write Unit Tests',
                description: 'Create comprehensive unit tests for all service methods and components.',
                priority: 'medium',
                status: 'todo',
                dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                tags: ['testing', 'quality']
            },
            {
                id: 4,
                title: 'Optimize Performance',
                description: 'Analyze and improve application performance, reduce bundle size and loading times.',
                priority: 'medium',
                status: 'todo',
                dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                tags: ['performance', 'optimization']
            },
            {
                id: 5,
                title: 'Update Documentation',
                description: 'Write comprehensive documentation for API endpoints and component usage.',
                priority: 'low',
                status: 'todo',
                dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                tags: ['documentation', 'api']
            },
            {
                id: 6,
                title: 'Fix Navigation Bug',
                description: 'Resolve issue with sidebar navigation not highlighting active route correctly.',
                priority: 'high',
                status: 'in-progress',
                dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                tags: ['bug', 'navigation', 'urgent']
            },
            {
                id: 7,
                title: 'Add Dark Mode Toggle',
                description: 'Implement theme switching functionality with persistent user preference.',
                priority: 'low',
                status: 'completed',
                dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
                tags: ['feature', 'ui', 'theme']
            },
            {
                id: 8,
                title: 'Database Migration',
                description: 'Plan and execute database schema migration for new feature requirements.',
                priority: 'high',
                status: 'todo',
                dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Overdue
                createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
                tags: ['database', 'migration', 'backend']
            }
        ];
    }
}
