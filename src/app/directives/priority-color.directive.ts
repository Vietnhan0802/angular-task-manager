import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

/**
 * PriorityColorDirective - Custom Attribute Directive
 * Demonstrates: Custom Directives, ElementRef, Renderer2, OnChanges lifecycle
 * 
 * Usage: <div [appPriorityColor]="task.priority">...</div>
 */
@Directive({
    selector: '[appPriorityColor]',
    standalone: false
})
export class PriorityColorDirective implements OnChanges {
    @Input() appPriorityColor: 'low' | 'medium' | 'high' = 'low';
    @Input() colorType: 'border' | 'background' | 'text' = 'border';

    private colorMap = {
        low: {
            main: '#10b981',
            light: 'rgba(16, 185, 129, 0.15)'
        },
        medium: {
            main: '#f59e0b',
            light: 'rgba(245, 158, 11, 0.15)'
        },
        high: {
            main: '#ef4444',
            light: 'rgba(239, 68, 68, 0.15)'
        }
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['appPriorityColor'] || changes['colorType']) {
            this.applyColor();
        }
    }

    private applyColor(): void {
        const colors = this.colorMap[this.appPriorityColor] || this.colorMap.low;

        switch (this.colorType) {
            case 'border':
                this.renderer.setStyle(this.el.nativeElement, 'border-left', `4px solid ${colors.main}`);
                break;
            case 'background':
                this.renderer.setStyle(this.el.nativeElement, 'background-color', colors.light);
                break;
            case 'text':
                this.renderer.setStyle(this.el.nativeElement, 'color', colors.main);
                break;
        }
    }
}
