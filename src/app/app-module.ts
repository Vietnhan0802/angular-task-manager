import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';

// Components
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

// Pages
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';

// Pipes
import { FilterTasksPipe } from './pipes/filter-tasks.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

// Directives
import { PriorityColorDirective } from './directives/priority-color.directive';
import { HoverEffectDirective } from './directives/hover-effect.directive';

/**
 * AppModule - Root module
 * Demonstrates: NgModule decorator, declarations, imports, providers
 */
@NgModule({
  declarations: [
    // Root component
    AppComponent,

    // Layout components
    HeaderComponent,
    SidebarComponent,

    // Page components
    DashboardComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskDetailComponent,

    // Pipes
    FilterTasksPipe,
    RelativeTimePipe,

    // Directives
    PriorityColorDirective,
    HoverEffectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           // Template-driven forms
    ReactiveFormsModule,   // Reactive forms
    HttpClientModule       // HTTP client
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
