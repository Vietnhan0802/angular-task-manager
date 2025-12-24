import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

/**
 * HoverEffectDirective - Custom Attribute Directive for hover effects
 * Demonstrates: HostListener decorator, dynamic styling
 * 
 * Usage: <div appHoverEffect>...</div>
 */
@Directive({
    selector: '[appHoverEffect]',
    standalone: false
})
export class HoverEffectDirective {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {
        // Set initial transition
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.25s ease');
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-4px)');
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 8px 25px rgba(0, 0, 0, 0.3)');
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
    }
}
