import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

/**
 * FilterTasksPipe - Custom Pipe for filtering tasks
 * Demonstrates: Custom Pipe implementation, PipeTransform interface
 * 
 * Usage: 
 * *ngFor="let task of tasks | filterTasks:status:priority:search"
 */
@Pipe({
    name: 'filterTasks',
    pure: false, // Impure pipe to detect array changes
    standalone: false
})
export class FilterTasksPipe implements PipeTransform {

    transform(
        tasks: Task[],
        status?: string,
        priority?: string,
        search?: string
    ): Task[] {
        if (!tasks || tasks.length === 0) {
            return [];
        }

        let filtered = [...tasks];

        // Filter by status
        if (status && status !== 'all') {
            filtered = filtered.filter(task => task.status === status);
        }

        // Filter by priority
        if (priority && priority !== 'all') {
            filtered = filtered.filter(task => task.priority === priority);
        }

        // Search filter
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower) ||
                task.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        return filtered;
    }
}
