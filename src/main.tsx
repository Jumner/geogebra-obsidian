import { App, Editor, MarkdownView, Modal, Notice, Plugin, addIcon, PluginSettingTab, Setting, Menu, MarkdownPostProcessorContext } from 'obsidian';
import * as React from "react";
import * as ReactDOM from "react-dom";
import Geo from "./geo";

declare global {
  interface Window {
    app1: any; // Declare apps
  }
}

// Remember to rename these classes and interfaces!

interface GeogebraSettings {
	randomSetting: string;
}

const DEFAULT_SETTINGS:GeogebraSettings  = {
	randomSetting: 'hello :)'
}

export default class GeogebraObsidian extends Plugin {
	settings: GeogebraSettings;

	generateText() {
		return `\`\`\`geogebra\nhello!\n\`\`\``;
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
			const main = el.createEl('div', {cls: "ggb-element"});
			function onUpdate(s:String) {
				console.log("save");
			}
			ReactDOM.render(
				<Geo />,
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

		containerEl.createEl('h2', {text: 'Geogebra Settings'});

		new Setting(containerEl)
			.setName('My test setting')
			.setDesc('Great description too.')
			.addText(text => text
				.setPlaceholder('With a neat placeholder')
				.setValue(this.plugin.settings.randomSetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.randomSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
