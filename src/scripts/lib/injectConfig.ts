interface InjectData {
  moduleId: string;
  inject?: string | JQuery<HTMLElement>;
  tab?: {
    name: string;
    label: string;
    icon: string;
    width?: number;
  };
  [key: string]: any; // For other properties like settings definitions
}

interface InjectElementData {
  label?: string;
  notes?: string;
  units?: string;
  type: string;
  default?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Record<string, string>;
  dType?: string;
  html?: string;
  fpTypes?: string[];
}

interface QuickInjectDoc {
  documentName: string;
  inject?: string;
}

export const injectConfig = {
  inject: function injectConfig(
    app: FormApplication, // Assuming a generic FormApplication, refine if possible
    html: JQuery<HTMLElement>,
    data: InjectData,
    object?: Document | any, // Could be a Document or Actor, Token, etc.
  ): JQuery<HTMLElement> | undefined {
    this._generateTabStruct(app, html, data, object);
    const tabSize = data.tab?.width ?? 110;
    object = object || app.object;
    const moduleId = data.moduleId;
    

    let injectHtmlString = "";

    for (const [k, v] of Object.entries(data)) {
      if (k === "moduleId" || k === "inject" || k === "tab") continue;
      const elemData = v as InjectElementData; // Assert v to InjectElementData
      const flag = "flags." + moduleId + "." + (k || "");
      const flagValue = object?.getFlag(moduleId, k) ?? elemData.default ?? getDefaultFlag(elemData.type);
      const notes = elemData.notes ? `<p class="notes">${elemData.notes}</p>` : "";
      const label = elemData.units
        ? elemData.label + `<span class="units"> (${elemData.units})</span>`
        : elemData.label;

      switch (elemData.type) {
        case "text":
          injectHtmlString += `<div class="form-group">
                        <label for="${k}">${label || ""}</label>
                            <input type="text" name="${flag}" ${
                              elemData.dType ? `data-dtype="${elemData.dType}"` : ""
                            } value="${flagValue}" placeholder="${elemData.placeholder || ""}">${notes}
                    </div>`;
          break;
        case "number":
          injectHtmlString += `<div class="form-group">
                        <label for="${k}">${label || ""}</label>
                            <input type="number" name="${flag}" min="${elemData.min}" max="${elemData.max}" step="${
                              elemData.step ?? 1
                            }" value="${flagValue}" placeholder="${elemData.placeholder || ""}">${notes}
                    </div>`;
          break;
        case "checkbox":
          injectHtmlString += `<div class="form-group">
                        <label for="${k}">${label || ""}</label>
                            <input type="checkbox" name="${flag}" ${flagValue ? "checked" : ""}>${notes}
                    </div>`;
          break;
        case "select":
          injectHtmlString += `<div class="form-group">
                        <label for="${k}">${label || ""}</label>
                            <select name="${flag}" ${elemData.dType ? `data-dtype="${elemData.dType}"` : ""}>`;
          for (const [i, j] of Object.entries(elemData.options || {})) {
            injectHtmlString += `<option value="${i}" ${flagValue == i ? "selected" : ""}>${j}</option>`;
          }
          injectHtmlString += `</select>${notes}
                    </div>`;
          break;
        case "range":
          injectHtmlString += `<div class="form-group">
            <label>${label || ""}</label>
            <div class="form-fields">
                <range-picker name="${flag}" value="${flagValue}" min="${elemData.min}" max="${elemData.max}" step="${elemData.step ?? 1}"></range-picker>
            </div>${notes}
          </div>`;
          break;
        case "color":
          injectHtmlString += `<div class="form-group">
            <label>${label || ""}</label>
            <div class="form-fields">
                <color-picker name="${flag}" value="${flagValue}"></color-picker>
            </div>${notes}
          </div>`;
          break;
        case "custom":
          injectHtmlString += elemData.html || "";
          break;
      }

      if (elemData.type?.includes("filepicker")) {
        const fpType = elemData.type.split(".")[1] || "imagevideo";
        injectHtmlString += `<div class="form-group">
          <label>${label || ""}</label>
          <div class="form-fields">     
              <file-picker name="${flag}" type="${fpType}" value="${flagValue}"></file-picker>
          </div>${notes}
        </div>`;
      }
    }

    const injectHtml = $(injectHtmlString);
    const tabs = $(html).find(".sheet-tabs").first();

    if (data.tab) {
      // Inject tab header
      let navHeader = _createTabHeader(tabs, data.tab.name, data.tab.label || "", data.tab.icon || "");
      tabs.append(navHeader);

      // Inject tab content
      let injectPoint = html.find(".window-content > .tab").last() as JQuery<HTMLElement>;
      const injectTab = _createTabContent(injectPoint, data.tab.name);
      injectPoint.after(injectTab);

      injectTab.append(injectHtml);

      // If no tab is currently active, make the newly injected tab the active one
      if (!tabs.find(".active").length) {
        navHeader.addClass("active");
        injectTab.addClass("active");
      }

      app?.setPosition({
        height: "auto",
        width: tabs.children().length * tabSize,
      });

      return injectHtml; // Should be injectTab?
    }

    if (app)
      app?.setPosition({
        height: "auto",
        width: tabs.children().length * tabSize,
      });

    return injectHtml;

    function _createTabHeader(tabs: JQuery<HTMLElement>, name: string, label: string, icon: string): JQuery<HTMLElement> {
      return $(`
      <a data-action="tab" data-group="sheet" data-tab="${name}">
        <i class="${icon}" inert></i> 
        <Span>${label}</span>
      </a>`);
    }

    function _createTabContent(injectPoint: JQuery<HTMLElement>, name: string): JQuery<HTMLElement> {
      const tabContainer = `<div class="tab scrollable" data-group="sheet" data-tab="${name}"></div>`;
      const $tab = $(tabContainer);
      return $tab;
    }

    function getDefaultFlag(inputType: string): any {
      switch (inputType) {
        case "number":
          return 0;
        case "checkbox":
          return false;
      }
      return "";
    }

  },

  quickInject: function quickInject(injectData: QuickInjectDoc | QuickInjectDoc[], data: InjectData): void {
    const docs = Array.isArray(injectData) ? injectData : [injectData];
    for (const doc of docs) {
      let newData = { ...data }; // Clone data to avoid modification across hooks
      if (doc.inject) {
        newData.inject = doc.inject;
      }
      Hooks.on(`render${doc.documentName}Config`, (app: FormApplication, html: JQuery<HTMLElement>) => {
        injectConfig.inject(app, html, newData);
      });
    }
  },

  _generateTabStruct: function _generateTabStruct(
    app: FormApplication,
    html: JQuery<HTMLElement>,
    data: InjectData,
    object?: any,
  ): void {
    const isTabs = $(html).find(".sheet-tabs").length > 0;
    const useTabs = data.tab;
    if (isTabs || !useTabs) return;
    const tabSize = data.tab?.width || 110;
    const layer = (app?.object as PlaceableObject)?.layer?.options?.name; // Type assertion for app.object
    const icon = $(".main-controls").find(`li[data-canvas-layer="${layer}"]`).find("i").attr("class");

    const $tabs = $(`
      <nav class="sheet-tabs tabs">
        <a class="item " data-tab="basic">
          <i class="${icon}"></i> ${game.i18n.localize("LIGHT.HeaderBasic")}
        </a>
      </nav>
      <div class="tab " data-tab="basic"></div>`);

    const form = $(html).find("form").first();
    if ($tabs.length > 2) {
      // Ensure $tabs has the expected structure
      form.children().each((i, e) => {
        ($tabs[2] as HTMLElement).append(e); // Type assertion for $tabs[2]
      });
    }

    form.append($tabs);
    const submitButton = $(html).find("button[type='submit']").first();
    form.append(submitButton);

    $(html).on("click", ".item", (e: JQuery.ClickEvent) => {
      $(html).find(".item").removeClass("active");
      $(e.currentTarget).addClass("active");
      $(html).find(".tab").removeClass("active");
      const tabs = $(html).find(".sheet-tabs").first();
      $(html)
        .find(`[data-tab="${(e.currentTarget as HTMLElement).dataset.tab}"]`)
        .addClass("active");
      app.setPosition({
        height: "auto",
        width: tabs.children().length * tabSize,
      });
    });
  },
};
