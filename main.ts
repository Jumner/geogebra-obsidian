import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface GeogebraSettings {
	randomSetting: string;
}

const DEFAULT_SETTINGS:GeogebraSettings  = {
	randomSetting: 'hello :)'
}

export default class GeogebraObsidian extends Plugin {
	settings: GeogebraSettings;

	async onload() {
		await this.loadSettings();

		//const statusBarItemEl = this.addStatusBarItem();
		//statusBarItemEl.setText('Status Bar Text');

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GeogebraSettingsTab(this.app, this));
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
