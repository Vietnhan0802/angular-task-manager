import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

/**
 * TaskFormComponent - Add/Edit Task Form
 * Demonstrates: Reactive Forms, FormBuilder, Validators, FormArray
 */
@Component({
    selector: 'app-task-form',
    standalone: false,
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
    taskForm!: FormGroup;
    isEditMode = false;
    taskId: number | null = null;
    isSubmitting = false;

    // For cleanup
    private destroy$ = new Subject<void>();

    // Form options
    priorityOptions = [
        { value: 'low', label: 'Low', icon: '🟢' },
        { value: 'medium', label: 'Medium', icon: '🟡' },
        { value: 'high', label: 'High', icon: '🔴' }
    ];

    statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize Reactive Form
     * Demonstrates: FormBuilder, FormGroup, Validators
     */
    private initForm(): void {
        this.taskForm = this.fb.group({
            title: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(500)
            ]],
            priority: ['medium', Validators.required],
            status: ['todo', Validators.required],
            dueDate: ['', Validators.required],
            tags: this.fb.array([])
        });
    }

    /**
     * Check if in edit mode and load task data
     */
    private checkEditMode(): void {
        const taskId = this.route.snapshot.paramMap.get('id');

        if (taskId) {
            this.isEditMode = true;
            this.taskId = +taskId;
            this.loadTaskData(this.taskId);
        }
    }

    /**
     * Load task data for editing
     */
    private loadTaskData(id: number): void {
        this.taskService.getTaskById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(task => {
                if (task) {
                    // Format date for input
                    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];

                    this.taskForm.patchValue({
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        dueDate: dueDate
                    });

                    // Load tags
                    this.clearTags();
                    task.tags.forEach(tag => this.addTag(tag));
                }
            });
    }

    /**
     * Get tags FormArray
     * Demonstrates: FormArray access
     */
    get tags(): FormArray {
        return this.taskForm.get('tags') as FormArray;
    }

    /**
     * Add new tag to FormArray
     */
    addTag(value: string = ''): void {
        if (this.tags.length < 5) {
            this.tags.push(this.fb.control(value, Validators.required));
        }
    }

    /**
     * Remove tag from FormArray
     */
    removeTag(index: number): void {
        this.tags.removeAt(index);
    }

    /**
     * Clear all tags
     */
    clearTags(): void {
        while (this.tags.length) {
            this.tags.removeAt(0);
        }
    }

    /**
     * Form submission
     * Demonstrates: Form validation, async operations
     */
    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.markFormGroupTouched(this.taskForm);
            return;
        }

        this.isSubmitting = true;
        const formValue = this.taskForm.value;

        // Convert tags array to string array
        const taskData = {
            ...formValue,
            dueDate: new Date(formValue.dueDate),
            tags: formValue.tags.filter((tag: string) => tag.trim() !== '')
        };

        if (this.isEditMode && this.taskId) {
            // Update existing task
            const updatedTask: Task = {
                ...taskData,
                id: this.taskId,
                createdAt: new Date() // Keep original createdAt in real app
            };

            this.taskService.updateTask(updatedTask)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isSubmitting = false;
                        this.router.navigate(['/tasks']);
                    },
                    error: () => {
                        this.isSubmitting = false;
                    }
                });
        } else {
            // Create new task
            this.taskService.addTask(taskData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isSubmitting = false;
                        this.router.navigate(['/tasks']);
                    },
                    error: () => {
                        this.isSubmitting = false;
                    }
                });
        }
    }

    /**
     * Mark all form controls as touched
     * Demonstrates: FormGroup iteration
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Check if field is invalid
     */
    isFieldInvalid(fieldName: string): boolean {
        const field = this.taskForm.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    /**
     * Get field error message
     */
    getFieldError(fieldName: string): string {
        const field = this.taskForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        if (field.errors['minlength']) {
            return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
        }
        if (field.errors['maxlength']) {
            return `Maximum ${field.errors['maxlength'].requiredLength} characters allowed`;
        }
        return '';
    }

    /**
     * Cancel form and go back
     */
    onCancel(): void {
        this.router.navigate(['/tasks']);
    }

    /**
     * Reset form
     */
    onReset(): void {
        this.taskForm.reset({
            priority: 'medium',
            status: 'todo'
        });
        this.clearTags();
    }
}
