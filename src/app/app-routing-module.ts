import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { TaskExistsGuard } from './guards/task-exists.guard';

/**
 * App Routing Module
 * Demonstrates: Angular Router, Route configuration, Guards, Redirects
 */
const routes: Routes = [
  // Default redirect to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Dashboard route
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  },

  // Tasks routes
  {
    path: 'tasks',
    component: TaskListComponent,
    data: { title: 'All Tasks' }
  },

  // Add new task
  {
    path: 'tasks/add',
    component: TaskFormComponent,
    data: { title: 'Add Task' }
  },

  // Edit task (with guard)
  {
    path: 'tasks/edit/:id',
    component: TaskFormComponent,
    canActivate: [TaskExistsGuard],
    data: { title: 'Edit Task' }
  },

  // Task detail (with guard)
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    canActivate: [TaskExistsGuard],
    data: { title: 'Task Detail' }
  },

  // Wildcard route - redirect to dashboard
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
