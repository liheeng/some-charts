import { Container as any } from "konva/lib/Container";
import { SvgCursor } from "./svg-cursor";

export enum CursorType {
    Default = 0,
    Cross = 1,
    Tooltip = 2,
}

export class CursorManager {
    private static instance: CursorManager;

    public static cursorMap: Map<CursorType, string> = new Map([
        [CursorType.Default, 'default'],
        // [CursorType.Cross, 'crosshair'],
        [CursorType.Cross, SvgCursor.CrossCursor],
        [CursorType.Tooltip, 'pointer'],
    ]);

    public static registerCursor(cursorType: CursorType | number, cursorStyle: string): void {
        this.cursorMap.set(cursorType, cursorStyle);
    }

    private currentCursorType: CursorType = CursorType.Default;
    private constructor(private container: any) {
        this.container = container;
    }

    public static Init(container: any): void {
        if (CursorManager.instance) {
            return;
        }

        CursorManager.instance = new CursorManager(container);
    }

    public static getInstance(): CursorManager {
        if (!CursorManager.instance) {
            throw new Error("CursorManager is not initialized");
        }
        return CursorManager.instance;
    }
    private currentCursor: string = 'default';
    
    public setCursor(cursorType: CursorType): void {
        if (cursorType === CursorType.Default) {
            this.currentCursorType = CursorType.Default;
            this.currentCursor = 'default';
            this.container.style.cursor = this.currentCursor;
            return
        }
        if (cursorType <= this.currentCursorType) {
            return
        }

        const cursor = CursorManager.cursorMap.get(cursorType);
        if (cursor) {
            this.currentCursorType = cursorType;
            this.currentCursor = cursor;
            this.container.style.cursor = this.currentCursor;
            return
        } else {
            this.resetCursor();
        }
    }
    
    public resetCursor(): void {
        this.currentCursorType = CursorType.Default;
        this.currentCursor = 'default';
        this.container.style.cursor = 'default';
    }
}
