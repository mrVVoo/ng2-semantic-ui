import { Component, Directive, Input, Output, EventEmitter, HostBinding, HostListener } from "@angular/core";
import { ICustomValueAccessorHost, customValueAccessorFactory, CustomValueAccessor } from "../../../misc/util/internal";

@Component({
    selector: "sui-rating",
    template: `
<span 
    *ngFor="let icon of icons; let i = index"
    [attr.data-position]="getLabelPosition(i)"
    [attr.data-tooltip]="getLabel(i)">
    <i class="{{ iconType }} icon"
       (mouseover)="onMouseover(i)"
       (click)="onClick(i)"
       [class.selected]="hoveredIndex >= i && !isReadonly"
       [class.active]="value > i"
    ></i>
</span>
`,
    styles: [`
:host.read-only .icon {
    cursor: auto
}
`]
})
export class SuiRating implements ICustomValueAccessorHost<number> {
    @HostBinding("class.ui")
    @HostBinding("class.rating")
    public readonly hasClasses:boolean;

    public value:number;

    @Output()
    public valueChange:EventEmitter<number>;

    @Output()
    public valueHover:EventEmitter<number>;

    private _maximum:number;

    @Input()
    public get maximum():number {
        return this._maximum;
    }

    public set maximum(value:number) {
        this._maximum = +value;
    }

    @HostBinding("class.read-only")
    @Input()
    public isReadonly:boolean;

    @Input()
    public iconType:string;

    @Input()
    public labels:string[] = [];

    @Input()
    public labelPosition:string = "top center";

    public get icons():undefined[] {
        // tslint:disable-next-line:prefer-literal
        return new Array(this.maximum);
    }

    public hoveredIndex:number = -1;

    constructor() {
        this.value = 0;
        this.valueChange = new EventEmitter<number>();
        this.valueHover = new EventEmitter<number>();

        this.maximum = 5;
        this.isReadonly = false;

        this.hasClasses = true;
    }

    public onClick(i:number):void {
        if (!this.isReadonly) {
            this.value = i + 1;
            this.valueChange.emit(this.value);
        }
    }

    public onMouseover(i:number):void {
        this.hoveredIndex = i;
        this.valueHover.emit(this.hoveredIndex);
    }

    public getLabelPosition(i:number):string|undefined {
        return this.hasLabel(i) ? this.labelPosition : undefined;
    }

    public hasLabel(i:number):boolean {
        return !!this.getLabel(i);
    }

    public getLabel(i:number):string {
        return this.labels[i];
    }

    @HostListener("mouseout")
    public onMouseout():void {
        this.hoveredIndex = -1;
        this.valueHover.emit(this.hoveredIndex);
    }

    public writeValue(value:number):void {
        this.value = value;
    }
}

@Directive({
    selector: "sui-rating",
    host: { "(valueChange)": "onChange($event)" },
    providers: [customValueAccessorFactory(SuiRatingValueAccessor)]
})
export class SuiRatingValueAccessor extends CustomValueAccessor<number, SuiRating> {
    constructor(host:SuiRating) {
        super(host);
    }
}
