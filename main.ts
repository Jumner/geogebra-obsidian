import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Menu } from 'obsidian';

// Remember to rename these classes and interfaces!

interface GeogebraSettings {
	randomSetting: string;
}

const DEFAULT_SETTINGS:GeogebraSettings  = {
	randomSetting: 'hello :)'
}

export default class GeogebraObsidian extends Plugin {
	settings: GeogebraSettings;

	generateIframe() {
		return `<iframe scrolling="no"
		src="https://www.geogebra.org/material/iframe/id/23587/width/1600/height/715/border/888888/rc/true/ai/true/sdz/false/smb/true/stb/true/stbh/true/ld/false/sri/false"
		width="1600px"
		height="715px"
		style="border:0px;" allowfullscreen>
		</iframe>`
	}

	insertGeo(editor: Editor) {
		console.log("insert geo");
		const position = editor.getCursor();
		editor.replaceRange('\n' + this.generateIframe(), {line: position.line, ch: editor.getLine(position.line).length});
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
		
		this.registerEvent(this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor, view: MarkdownView) => {
			if(view) {
				menu.addItem((item) => {
					item.setTitle("Insert Geogebra").setIcon("chart").onClick((_) => {this.insertGeo(editor)});
				});
			}
		}));
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
