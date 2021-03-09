export default class AetherItemSheet extends ItemSheet {
    get template () {
        return `systems/aether/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData () {
        const data = super.getData();

        data.config = CONFIG.aether;

        return data;
    }
}