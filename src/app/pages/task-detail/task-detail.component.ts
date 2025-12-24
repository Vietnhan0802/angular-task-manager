import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

/**
 * TaskDetailComponent - Display task details
 * Demonstrates: Route parameters, switchMap operator
 */
@Component({
    selector: 'app-task-detail',
    standalone: false,
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
    task$!: Observable<Task | undefined>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService
    ) { }

    ngOnInit(): void {
        // Get task by route parameter using switchMap
        this.task$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = Number(params.get('id'));
                return this.taskService.getTaskById(id);
            })
        );
    }

    onEdit(taskId: number): void {
        this.router.navigate(['/tasks/edit', taskId]);
    }

    onDelete(taskId: number): void {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskService.deleteTask(taskId).subscribe(() => {
                this.router.navigate(['/tasks']);
            });
        }
    }

    onBack(): void {
        this.router.navigate(['/tasks']);
    }

    toggleStatus(task: Task): void {
        this.taskService.toggleTaskStatus(task.id).subscribe();
    }

    getPriorityInfo(priority: string): { icon: string; label: string; class: string } {
        const map: { [key: string]: { icon: string; label: string; class: string } } = {
            'low': { icon: '🟢', label: 'Low Priority', class: 'priority-low' },
            'medium': { icon: '🟡', label: 'Medium Priority', class: 'priority-medium' },
            'high': { icon: '🔴', label: 'High Priority', class: 'priority-high' }
        };
        return map[priority] || map['low'];
    }

    getStatusInfo(status: string): { icon: string; label: string; class: string } {
        const map: { [key: string]: { icon: string; label: string; class: string } } = {
            'todo': { icon: '📋', label: 'To Do', class: 'status-todo' },
            'in-progress': { icon: '🔄', label: 'In Progress', class: 'status-in-progress' },
            'completed': { icon: '✅', label: 'Completed', class: 'status-completed' }
        };
        return map[status] || map['todo'];
    }

    isOverdue(task: Task): boolean {
        return task.status !== 'completed' && new Date(task.dueDate) < new Date();
    }
}
