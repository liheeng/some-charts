import Konva from 'konva';
import { TooltipOptions, TooltipOptionsDefaults } from '../../options/tooltip-options';

export class Tooltip extends Konva.Label {
    protected options: TooltipOptions;

    protected border: Konva.Tag

    protected text: Konva.Text

    constructor(options: TooltipOptions = TooltipOptionsDefaults.Instance.extendWith(undefined)) {
        super({ opacity: options.opacity, visible: options.visible, listening: options.listening });
        this.options = options;

        this.border = new Konva.Tag(options as any)
        this.text = new Konva.Text({
            text: '',
            fontFamily: options.font?.family,
            fontSize: options.font?.size,
            padding: options.padding,
            fill: options.foregroundColor as string,
        })
        this.add(this.border);
        this.add(this.text);
    }

    public updateText(text: string) {
        this.getText().text(text);
    }

    public showAt(x: number, y: number, text: string = '') {
        if (text !== '') {
            this.updateText(text);
        }
        this.position({
            x: x,
            y: y,
        });
        this.show();
    }
}