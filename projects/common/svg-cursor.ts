import { SvgCursorOptions, SvgCursorOptionsDefaults } from "./svg-cursor-options";

export class SvgCursor {
    public static svgToBase64Cursor(svgString: string, options: SvgCursorOptions = SvgCursorOptionsDefaults.Instance.defaultSkin): string {
        // Encode the SVG into Base64
        const {width, height, hotspotX, hotspotY, stroke, strokeWidth, fill} = {...options};
        svgString = svgString.replace('${width}', width?.toString())
            .replace('${height}', height?.toString())
            .replace('${stroke}', stroke)
            .replace('${strokeWidth}', strokeWidth?.toString())
            .replace('${fill}', fill?.toString() || 'none');
        const base64 = btoa(unescape(encodeURIComponent(svgString)));
        return `url("data:image/svg+xml;base64,${base64}") ${hotspotX} ${hotspotY}, auto`;
    }

    public static CrossCursor = SvgCursor.svgToBase64Cursor('<svg width="${width}" height="${height}" viewBox="0 0 23 23" \
        xmlns="http://www.w3.org/2000/svg"><path d="M0 10H10V0H13V10H23V13H13V23H10V13H0V10Z" \
        stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/></svg>');
}