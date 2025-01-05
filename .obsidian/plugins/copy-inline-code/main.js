/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CopyInlineCodePlugin
});
module.exports = __toCommonJS(main_exports);

// src/settings.ts
var import_obsidian = require("obsidian");
var CopyInlineCodePluginTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("p", {
      cls: "tasks-setting-important",
      text: "Changing any settings requires a restart of obsidian."
    });
    new import_obsidian.Setting(containerEl).setName("Show on hover").setDesc("Copy icon only visible on hover (restart obsidian after change)").addToggle((component) => {
      component.setValue(this.plugin.settings.showOnHover).onChange(async (value) => {
        this.plugin.settings.showOnHover = value;
        await this.plugin.saveSettings();
      });
    });
  }
};

// src/main.ts
var import_obsidian3 = require("obsidian");

// src/copy-inline-code-view-plugin.ts
var import_language = require("@codemirror/language");
var import_state = require("@codemirror/state");
var import_view2 = require("@codemirror/view");

// src/copy-code-widget.ts
var import_view = require("@codemirror/view");
var import_obsidian2 = require("obsidian");
var CopyWidget = class extends import_view.WidgetType {
  constructor(showOnHover) {
    super();
    this.showOnHover = showOnHover;
  }
  toDOM(view) {
    const icon = createSpan({ cls: "copy-to-clipboard-icon", text: "\xA0\u{1F4CB}" });
    icon.toggleClass("show-on-hover", this.showOnHover);
    icon.onclick = (event) => {
      const element = event.target;
      let previousElement = element.previousElementSibling;
      while (previousElement && !previousElement.matches(".cm-inline-code:not(.cm-formatting)")) {
        previousElement = previousElement.previousElementSibling;
      }
      const textToCopy = previousElement == null ? void 0 : previousElement.textContent;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        new import_obsidian2.Notice(`Copied '${textToCopy}' to clipboard!`);
      }
    };
    return icon;
  }
};

// src/copy-inline-code-view-plugin.ts
var CopyInlineCodeViewPlugin = class {
  constructor(view, showOnHover) {
    this.showOnHover = showOnHover;
    this.decorations = this.buildDecorations(view);
  }
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }
  destroy() {
  }
  buildDecorations(view) {
    const builder = new import_state.RangeSetBuilder();
    const showOnHover = this.showOnHover;
    for (const { from, to } of view.visibleRanges) {
      (0, import_language.syntaxTree)(view.state).iterate({
        from,
        to,
        enter(node) {
          if (node.type.name.startsWith("inline-code")) {
            builder.add(
              node.to + 1,
              node.to + 1,
              import_view2.Decoration.widget({
                widget: new CopyWidget(showOnHover)
              })
            );
          }
        }
      });
    }
    return builder.finish();
  }
};
var createCopyPlugin = (showOnHover) => {
  return import_view2.ViewPlugin.define(
    (view) => new CopyInlineCodeViewPlugin(view, showOnHover),
    {
      decorations: (p) => p.decorations
    }
  );
};

// src/main.ts
var DEFAULT_SETTINGS = {
  showOnHover: false
};
var CopyInlineCodePlugin = class extends import_obsidian3.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new CopyInlineCodePluginTab(this.app, this));
    this.copyInlineCodeLogic();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async copyInlineCodeLogic() {
    this.registerEditorExtension([createCopyPlugin(this.settings.showOnHover)]);
    this.registerMarkdownPostProcessor((element, context) => {
      const inlineCodes = element.querySelectorAll("*:not(pre) > code");
      inlineCodes.forEach((code) => {
        if (code.querySelector("span.copy-to-clipboard-icon")) {
          return;
        }
        const icon = createSpan({ cls: "copy-to-clipboard-icon", text: "\xA0\u{1F4CB}" });
        icon.toggleClass("show-on-hover", this.settings.showOnHover);
        const textToCopy = code.textContent;
        icon.onclick = (event) => {
          if (textToCopy) {
            event.stopPropagation();
            navigator.clipboard.writeText(textToCopy);
            new import_obsidian3.Notice(`Copied '${textToCopy}' to clipboard!`);
          }
        };
        code.appendChild(icon);
      });
    });
  }
};
