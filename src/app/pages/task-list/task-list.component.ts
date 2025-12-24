import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Task, TaskFilter } from '../../models/task.model';

/**
 * TaskListComponent - Displays list of all tasks with filtering
 * Demonstrates: Two-way binding, Event handling, ngModel, Property binding
 */
@Component({
    selector: 'app-task-list',
    standalone: false,
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    isLoading = false;

    // Filter state - demonstrates two-way binding
    filter: TaskFilter = {
        status: 'all',
        priority: 'all',
        search: ''
    };

    // View mode
    viewMode: 'grid' | 'list' = 'grid';

    // Cleanup subject
    private destroy$ = new Subject<void>();

    // Filter options
    statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    priorityOptions = [
        { value: 'all', label: 'All Priority' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
    ];

    constructor(
        private taskService: TaskService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load tasks from service
     */
    loadTasks(): void {
        this.isLoading = true;
        this.taskService.tasks$
            .pipe(takeUntil(this.destroy$))
            .subscribe(tasks => {
                this.tasks = tasks;
                this.applyFilters();
                this.isLoading = false;
            });
    }

    /**
     * Apply filters to tasks
     * Demonstrates: Array filtering, search functionality
     */
    applyFilters(): void {
        let filtered = [...this.tasks];

        // Status filter
        if (this.filter.status && this.filter.status !== 'all') {
            filtered = filtered.filter(t => t.status === this.filter.status);
        }

        // Priority filter
        if (this.filter.priority && this.filter.priority !== 'all') {
            filtered = filtered.filter(t => t.priority === this.filter.priority);
        }

        // Search filter
        if (this.filter.search && this.filter.search.trim()) {
            const searchLower = this.filter.search.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchLower) ||
                t.description.toLowerCase().includes(searchLower) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Sort by due date
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        this.filteredTasks = filtered;
    }

    /**
     * Handle filter change
     * Demonstrates: Event handling, method binding
     */
    onFilterChange(): void {
        this.applyFilters();
    }

    /**
     * Clear all filters
     */
    clearFilters(): void {
        this.filter = {
            status: 'all',
            priority: 'all',
            search: ''
        };
        this.applyFilters();
    }

    /**
     * Toggle task status
     */
    toggleStatus(task: Task, event: Event): void {
        event.stopPropagation();
        this.taskService.toggleTaskStatus(task.id).subscribe();
    }

    /**
     * Delete task
     */
    deleteTask(taskId: number, event: Event): void {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskService.deleteTask(taskId).subscribe();
        }
    }

    /**
     * Navigate to edit task
     */
    editTask(taskId: number): void {
        this.router.navigate(['/tasks/edit', taskId]);
    }

    /**
     * Navigate to task detail
     */
    viewTask(taskId: number): void {
        this.router.navigate(['/tasks', taskId]);
    }

    /**
     * Toggle view mode
     */
    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    }

    /**
     * Check if task is overdue
     */
    isOverdue(task: Task): boolean {
        return task.status !== 'completed' && new Date(task.dueDate) < new Date();
    }

    /**
     * Track by function for ngFor performance
     */
    trackByTaskId(index: number, task: Task): number {
        return task.id;
    }
}
