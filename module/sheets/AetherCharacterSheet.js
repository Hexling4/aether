export default class AetherCharacterSheet extends ActorSheet {
    static get defaultOptions () {
        return mergeObject(super.defaultOptions, {
            template: "systems/aether/templates/sheets/character-sheet.hbs",
            classes: ["aether", "sheet", "character"]
        });
    }
}