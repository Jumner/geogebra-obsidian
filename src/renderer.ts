import { MarkdownPostProcessorContext, MarkdownRenderChild, parseYaml } from 'obsidian';

export default class Renderer {
	constructor() {}
	render(data:string, el:HTMLElement, ctx:MarkdownPostProcessorContext) {
		ctx.addChild(new GeogebraRenderChild(data, el, this));
	}
}

class GeogebraRenderChild extends MarkdownRenderChild {
	data:string;
	renderer:Renderer;

	constructor(data:string, el:HTMLElement, renderer:Renderer) {
		super(el);
		this.data = data;
	}
	onload() {
		const element = this.containerEl.createSpan({
			text: this.data,
		});
		this.containerEl.replaceWith(element);
	}
}
