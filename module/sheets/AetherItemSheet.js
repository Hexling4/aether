export default class AetherItemSheet extends ItemSheet {
    static get defaultOptions () {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 340,
            class: ["aether", "sheet", "item"]
        });
    }
    
    get template () {
        return `systems/aether/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData () {
        const data = super.getData();

        data.config = CONFIG.aether;

        return data;
    }
}