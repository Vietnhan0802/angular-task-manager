import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TaskService } from '../services/task.service';

/**
 * TaskExistsGuard - Route Guard to check if task exists
 * Demonstrates: CanActivate interface, Route Guards, Observable return
 */
@Injectable({
    providedIn: 'root'
})
export class TaskExistsGuard implements CanActivate {

    constructor(
        private taskService: TaskService,
        private router: Router
    ) { }

    /**
     * Check if task exists before allowing navigation
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const taskId = route.paramMap.get('id');

        if (!taskId) {
            this.router.navigate(['/tasks']);
            return false;
        }

        return this.taskService.getTaskById(Number(taskId)).pipe(
            map(task => {
                if (task) {
                    return true;
                } else {
                    console.warn(`Task with ID ${taskId} not found`);
                    this.router.navigate(['/tasks']);
                    return false;
                }
            }),
            catchError(error => {
                console.error('Error checking task existence:', error);
                this.router.navigate(['/tasks']);
                return of(false);
            })
        );
    }
}
