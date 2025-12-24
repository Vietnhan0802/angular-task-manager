import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
    icon: string;
    label: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    isCollapsed = false;
    currentRoute = '';

    navItems: NavItem[] = [
        { icon: '📊', label: 'Dashboard', route: '/dashboard' },
        { icon: '📋', label: 'All Tasks', route: '/tasks' },
        { icon: '➕', label: 'Add Task', route: '/tasks/add' }
    ];

    quickFilters = [
        { icon: '🎯', label: 'High Priority', count: 3 },
        { icon: '⏰', label: 'Due Today', count: 2 },
        { icon: '⚠️', label: 'Overdue', count: 1 }
    ];

    constructor(private router: Router) {
        // Subscribe to router events to track current route
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.currentRoute = event.urlAfterRedirects;
        });
    }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    isActive(route: string): boolean {
        return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
    }

    navigate(route: string): void {
        this.router.navigate([route]);
    }
}
