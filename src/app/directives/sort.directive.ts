import { Directive, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appSort]'
})
export class SortDirective {

  @Input() public appSort: any;
  @Input() public column: any;
  @Output() public sortChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  public get config(): any {
    return this.appSort;
  }

  public set config(value: any) {
    this.appSort = value;
  }

  @HostListener('click', ['$event', '$target'])
  public onToggleSort(event: any): void {
    if (event) {
      event.preventDefault();
    }

    if (this.appSort && this.column && this.column.sort !== false) {
      switch (this.column.sort) {
        case 'asc':
          this.column.sort = 'desc';
          break;
        case 'desc':
          this.column.sort = '';
          break;
        default:
          this.column.sort = 'asc';
          break;
      }

      this.sortChanged.emit(this.column);
    }
  }
}
