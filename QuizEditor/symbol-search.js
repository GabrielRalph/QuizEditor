import { WBlock, ToggleInput } from "../Utilities/shared.js";
import {SvgPlus} from "../SvgPlus/4.js"
import {Icon} from "../Utilities/icons.js"
import { searchSymbols, deleteSymbol, uploadSymbol } from "../Firebase/symbols.js";

const MAX_FILE_SIZE = 50 * 1024;
const STATUS_TEXT = {
    "0": "Starting",
    "1": "Converting to PNG",
    "2": "Creating search vector",
    "3": "Cheking similarity",
    "3.3": "Creating Icon Info",
    "3.6": "Saving Icon File",
    "4": "Complete"
}


class UploadForm extends SvgPlus {
    constructor(searchWidget){
        super("div");
        this.class = "upload-form";
        this.sWidget = searchWidget;

        let all = this.createChild("div", {class: "col"})
        let mainRow = all.createChild("div", {class: "row main-row"});

        this.progressBar = all.createChild("div", {class: "progress-bar"});
        
        let upicon = mainRow.createChild("div", {
            class: "upload-icon",
            events: {
                click: () => {
                    this.getImage();
                }
            }
        })
        upicon.createChild(Icon, {}, "upload-img");
        this.upicon = upicon;

        let inputs = mainRow.createChild("div", {class: "col"})
        
        let save = mainRow.createChild("div", {
            class: "row save-icon",
            events: {
                click: () => this.uploadSymbol()
            }
        });
        save.createChild("span", {content: "save"});
        save.createChild(Icon, {}, "save")
        save.toggleAttribute("disabled", true)
        this.saveIcon = save;

        let row = inputs.createChild("div", {class: "row"});
        row.createChild("span", {content: "Icon Name: "});
        let name = row.createChild("input", {
            events: {
                input: () => {
                    save.toggleAttribute("disabled", (name.value.length == 0) || this.fileError)
                }
            }
        });
        this.nameInput = name;

        row = inputs.createChild("div", {class: "row"});
        row.createChild("span", {content: "Make Public: "})
        let pub = row.createChild(ToggleInput);
        this.publicInput = pub;

        this.getImage();
    }

    async getImage(){
        /** @type {HTMLInputElement} */
        let a = new SvgPlus("input");
        a.props = {
            type: "file", 
            accept: "image"
        }
        await new Promise((resolve, reject) => {
            a.oninput = resolve;
            a.click()
        })

        const file = a.files[0];
        this.fileError = file.size > MAX_FILE_SIZE;
        if (file.size > MAX_FILE_SIZE) {
            this.upicon.setAttribute("error", `Size exceeds ${Math.round(MAX_FILE_SIZE / 1024)}kB`)
        } else {
            this.upicon.toggleAttribute("error", false)
            this.file = file;
        }
        this.saveIcon.toggleAttribute("disabled", (this.nameInput.value.length == 0) || this.fileError)

        let url = await new Promise((resolve, reject) => {
            let fr = new FileReader();
            fr.onload = () => resolve(fr.result)
            fr.readAsDataURL(a.files[0])
        })
        this.upicon.styles = {
            "background-image": `url("${url}")`
        }
    }

    async uploadSymbol(){
        this.sWidget.loading = true;
        this.toggleAttribute("loading", true)
        this.progressBar.toggleAttribute("error", false)
        let name = this.nameInput.value
        let results = await uploadSymbol(this.file, name, this.publicInput.value, (p, stat) => {
            this.progressBar.styles = {
                "--percent": 1-p,
                "--progress-text": `"${Math.round(p*100)}% ${STATUS_TEXT[stat]}"`
            }
        })

        if (results.valid) {
            let {similar} = results;
            let newi = {
                name: name,
                url: results.url,
                id: results.symbolID,
                match: 0,
                new: true
            }
            similar.unshift(newi);
            let event = new Event("complete");
            event.results = similar;
            this.dispatchEvent(event);
        } else {
            console.log("Upload Symbol Error", results);
            let isImgErr = results.errors.join(" ").indexOf("Image conversion failed");
            if (isImgErr == -1) {
                this.progressBar.setAttribute("error", "An Error occured, please try again.")
            } else {
                this.progressBar.setAttribute("error", "Image conversion failed this may be due to your image format.")
            }
        }
        this.toggleAttribute("loading", false)
        this.sWidget.loading = false;
    }
}

export class SearchWidget extends SvgPlus {
    constructor(){
        super("div");
        this.class = "search-window";
        let block = this.createChild(WBlock, {class: "search-widget"});
        this.main = block.main;
        this.head = block.head;

        let col = block.head.createChild("div", {class: 'col'});
        let row = col.createChild("div", {class: "row"})
        this.searchInput = row.createChild("input", {
            events: {
                keypress: (e) => {
                    if (e.key == "Enter") {
                        this.searchSymbols();
                    }
                }
            }
        })
        row.createChild(Icon, {
            events: {
                click: () => {
                    this.searchSymbols();
                }
            }
        }, "search")

        
        row.createChild(Icon, {
            events: {
                click: () => {
                    this.close(null)
                }
            }
        }, "close");

        row = col.createChild("div", {class: "row"});
        let d = row.createChild("div", {class: "row"});
        d.createChild("span", {content: "owned"});
        this.modeToggle = d.createChild(ToggleInput)

        row.createChild(Icon, {
            events: {
                click: () => {
                    this.uploadIcon()
                }
            }
        }, "upload-img");
    }

    /** @param {boolean} bool */
    set loading(bool) {
        this.toggleAttribute("loading", bool);
    }

    /** @return {Promise<import("../Utilities/icons.js").IconInfo>} */
    async getSymbol(){
        this.toggleAttribute("shown", true);
        let results = await new Promise((r) => this.onclose = r);
        this.toggleAttribute("shown", false);
        return results;
    }

    close(result) {
        if (this.onclose instanceof Function) {
            this.onclose(result);
        }
    }

    uploadIcon(){
        this.main.innerHTML = "";
        this.main.createChild(UploadForm, {events: {
            complete: (event) => {
                this.modeToggle.value = false;
                this.showResults(event.results)
            }
        }}, this);
    }

    async searchSymbols(){
        let mode = !this.modeToggle.value ? "all" : "user";
        let text = this.searchInput.value;
        if (text.length > 0) {
            this.loading = true;
            let items = await searchSymbols(text, mode);
            this.loading = false;
            this.showResults(items);
        }
    }

    showResults(items) {
        this.main.innerHTML = "";
        let list = this.main.createChild("div", {class: "symbols-list"});
        items.sort((a, b) => a.match - b.match)
        items.slice(0, 12).map(i => {
            let item = list.createChild("div", {
                name: i.name,
                match: i.match,
                style: {
                    "background-image": `url("${i.url}")`
                },
                events: {
                    click: () => this.close(i)
                }
            })
            item.toggleAttribute("new", !!i.new);
            item.toggleAttribute("owned", !!i.owned);
            if (i.owned) {
                item.createChild(Icon, {
                    events: {
                        /** @param {MouseEvent} e*/
                        click: async (e) => {
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            this.loading = true;
                            let results = await deleteSymbol(i.id, "id");
                            console.log(results);
                            if (results.success) {
                                item.remove();
                            }
                            this.loading = false;
                            
                        }
                    }
                }, "trash");
            }
        })
    }
}



