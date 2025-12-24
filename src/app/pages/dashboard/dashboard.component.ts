import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatistics } from '../../models/task.model';

/**
 * DashboardComponent - Main dashboard with statistics
 * Demonstrates: OnInit, OnDestroy lifecycle hooks, Observable subscription management
 */
@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
    // Observables
    statistics$!: Observable<TaskStatistics>;
    recentTasks$!: Observable<Task[]>;

    // For cleanup
    private destroy$ = new Subject<void>();

    // Stats cards configuration
    statsCards = [
        {
            title: 'Total Tasks',
            key: 'total',
            icon: '📋',
            color: 'primary',
            gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)'
        },
        {
            title: 'Completed',
            key: 'completed',
            icon: '✅',
            color: 'success',
            gradient: 'linear-gradient(135deg, #10b981, #059669)'
        },
        {
            title: 'In Progress',
            key: 'inProgress',
            icon: '🔄',
            color: 'warning',
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
        },
        {
            title: 'Overdue',
            key: 'overdue',
            icon: '⚠️',
            color: 'danger',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
        }
    ];

    constructor(public taskService: TaskService) { }

    /**
     * OnInit lifecycle hook
     * Demonstrates: Component initialization, Observable assignment
     */
    ngOnInit(): void {
        console.log('DashboardComponent initialized');

        // Get statistics observable
        this.statistics$ = this.taskService.getStatistics();

        // Get recent tasks (last 5)
        this.recentTasks$ = this.taskService.tasks$.pipe(
            takeUntil(this.destroy$)
        );
    }

    /**
     * OnDestroy lifecycle hook
     * Demonstrates: Cleanup subscriptions to prevent memory leaks
     */
    ngOnDestroy(): void {
        console.log('DashboardComponent destroyed');
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Get stat value by key
     */
    getStatValue(stats: TaskStatistics, key: string): number {
        return (stats as any)[key] || 0;
    }

    /**
     * Get priority badge class
     */
    getPriorityClass(priority: string): string {
        return `badge-${priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success'}`;
    }

    /**
     * Get status badge class
     */
    getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            'todo': 'badge-secondary',
            'in-progress': 'badge-primary',
            'completed': 'badge-success'
        };
        return statusMap[status] || 'badge-secondary';
    }

    /**
     * Toggle task status
     */
    toggleTaskStatus(taskId: number): void {
        this.taskService.toggleTaskStatus(taskId).subscribe();
    }
}
