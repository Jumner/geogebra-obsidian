import { App, Editor, MarkdownView, Modal, Notice, Plugin, addIcon, PluginSettingTab, Setting, Menu, MarkdownPostProcessorContext } from 'obsidian';
import * as React from "react";
import * as ReactDOM from "react-dom";
import Geogebra from "react-geogebra";
import * as Yaml from "js-yaml";
// const yaml = require('js-yaml');

// Remember to rename these classes and interfaces!

interface GeogebraSettings {
width: number;
height: number;
showAlgebraInput: boolean;
showToolBar: boolean;
showMenuBar: boolean;
}

const DEFAULT_SETTINGS:GeogebraSettings  = {
width: 800,
			 height: 600,
			 showAlgebraInput: true,
			 showToolBar: false,
			 showMenuBar: false
}

Geogebra.defaultProps = {
appName: "classic",
				 width: DEFAULT_SETTINGS.width,
				 height: DEFAULT_SETTINGS.height,
				 showAlgebraInput: DEFAULT_SETTINGS.showAlgebraInput,
				 showToolBar: DEFAULT_SETTINGS.showToolBar,
				 showMenuBar: DEFAULT_SETTINGS.showMenuBar,
				 reloadOnPropChange: false,
};

export default class GeogebraObsidian extends Plugin {
settings: GeogebraSettings;

					generateText() {
						return `\`\`\`geogebra\nid: INSERT_ID\nwidth: ${DEFAULT_SETTINGS.width}\nheight: ${DEFAULT_SETTINGS.height}\nshowAlgebraInput: ${DEFAULT_SETTINGS.showAlgebraInput}\nshowToolBar: ${DEFAULT_SETTINGS.showToolBar}\nshowMenuBar: ${DEFAULT_SETTINGS.showMenuBar}\n\`\`\``;
					}

					insertGeo(editor: Editor) {
						console.log("insert geo");
						const position = editor.getCursor();
						editor.replaceRange('\n' + this.generateText(), {line: position.line, ch: editor.getLine(position.line).length});
					}


					async onload() {
						await this.loadSettings();

						//const statusBarItemEl = this.addStatusBarItem();
						//statusBarItemEl.setText('Status Bar Text');

						// This adds a complex command that can check whether the current state of the app allows execution of the command
						this.addCommand({
id: 'insert-geogebra',
name: 'Insert Geogebra',
editorCallback: (editor: Editor, view: MarkdownView) => {
this.insertGeo(editor);
}
});

// This adds a settings tab so the user can configure various aspects of the plugin
this.addSettingTab(new GeogebraSettingsTab(this.app, this));

addIcon("geogebra", `
		<path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#666" stroke-width="2.2" d="m15.3,4.7a11.4,9.1-26 1,0 1,0z"/>
		<g xmlns="http://www.w3.org/2000/svg" stroke-linecap="round">
		<path stroke="#000" stroke-width="6" d="m13.2,4.9h0M3.8,11.8h0M7.2,22.9h0M20.1,21.2h0M24.4,10.1h0"/>
		<path stroke="#99F" stroke-width="4.3" d="m13.2,4.9h0M3.8,11.8h0M7.2,22.9h0M20.1,21.2h0M24.4,10.1h0"/>
		</g>`); // Add icon

this.registerEvent(this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor, view: MarkdownView) => {
			if(view) {
			menu.addItem((item) => {
					item.setTitle("Insert Geogebra").setIcon("geogebra").onClick((_) => {this.insertGeo(editor)});
					});
			}
			}));

// Register the code block
this.registerMarkdownCodeBlockProcessor("geogebra", (content, el, ctx) => {
		const options = Yaml.load(content);
		console.log(options)
		const main = el.createEl('div', {cls: "ggb-element"});
		ReactDOM.render(
				<Geogebra
				{...options}
				material_id={options.id}
				appletOnLoad={() => {console.log("geo loaded")}}
				/>,
				main
				);
		// const header = main.createEl('h1', {text: 'Geogebra moment\n'});
		// const text = main.createEl('p', {text: content});
		});
}

onunload() {

}

async loadSettings() {
	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
}

async saveSettings() {
	await this.saveData(this.settings);
}
}

class GeogebraSettingsTab extends PluginSettingTab {
plugin: GeogebraObsidian;

				constructor(app: App, plugin: GeogebraObsidian) {
					super(app, plugin);
					this.plugin = plugin;
				}

				display(): void {
					const {containerEl} = this;

					containerEl.empty();

					containerEl.createEl('h2', {text: 'Default Geogebra Settings'});
					new Setting(containerEl)
						.setName("Embed Size")
						.setDesc("The default embed size")
						.addText(text => text
								.setPlaceholder("Width in pixels")
								.setValue(this.plugin.settings.width.toString())
								.onChange(async (value) => {
									this.plugin.settings.width = +value;
									await this.plugin.saveSettings();
									}))
					.addText(text => text
							.setPlaceholder("Height in pixels")
							.setValue(this.plugin.settings.height.toString())
							.onChange(async (value) => {
								this.plugin.settings.height = +value;
								await this.plugin.saveSettings();
								}));
					new Setting(containerEl)
						.setName("Toggle Algebra Input Bar")
						.setDesc("Toggle the bar that allows equations to be changed (note the website is needed to save)")
						.addToggle(cb => cb
								.setValue(this.plugin.settings.showAlgebraInput)
								.onChange(async (value) => {
									this.plugin.settings.showAlgebraInput = value;
									await this.plugin.saveSettings();
									})
								);
					new Setting(containerEl)
						.setName("Toggle Tool Bar")
						.setDesc("Toggle the toolbar")
						.addToggle(cb => cb
								.setValue(this.plugin.settings.showToolBar)
								.onChange(async (value) => {
									this.plugin.settings.showToolBar = value;
									await this.plugin.saveSettings();
									})
								);
					new Setting(containerEl)
						.setName("Toggle Menu Bar")
						.setDesc("Toggle the menu bar")
						.addToggle(cb => cb
								.setValue(this.plugin.settings.showMenuBar)
								.onChange(async (value) => {
									this.plugin.settings.showMenuBar = value;
									await this.plugin.saveSettings();
									})
								);


					//containerEl.createEl('h2', {text: 'Default Desmos Settings'});
				}
}
