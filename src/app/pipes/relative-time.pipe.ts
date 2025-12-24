import { Pipe, PipeTransform } from '@angular/core';

/**
 * RelativeTimePipe - Custom Pipe for displaying relative time
 * Demonstrates: Date manipulation, custom formatting
 * 
 * Usage: {{ task.dueDate | relativeTime }}
 */
@Pipe({
    name: 'relativeTime',
    pure: true,
    standalone: false
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: Date | string): string {
        if (!value) return '';

        const date = new Date(value);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        // Past dates
        if (diffMs < 0) {
            const absDays = Math.abs(diffDays);
            const absHours = Math.abs(diffHours);
            const absMinutes = Math.abs(diffMinutes);

            if (absDays > 30) {
                return `${Math.floor(absDays / 30)} month(s) ago`;
            } else if (absDays > 0) {
                return `${absDays} day(s) ago`;
            } else if (absHours > 0) {
                return `${absHours} hour(s) ago`;
            } else if (absMinutes > 0) {
                return `${absMinutes} minute(s) ago`;
            }
            return 'Just now';
        }

        // Future dates
        if (diffDays === 0) {
            if (diffHours === 0) {
                return diffMinutes <= 0 ? 'Now' : `In ${diffMinutes} minute(s)`;
            }
            return `In ${diffHours} hour(s)`;
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays < 7) {
            return `In ${diffDays} days`;
        } else if (diffDays < 30) {
            return `In ${Math.floor(diffDays / 7)} week(s)`;
        } else {
            return `In ${Math.floor(diffDays / 30)} month(s)`;
        }
    }
}
