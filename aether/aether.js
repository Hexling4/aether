import { aether } from "./module/config.js"
import AetherItemSheet from "./module/sheets/AetherItemSheet.js"

Hooks.once("init", function () {
    console.log("aether | Initializing The Aether System");

    CONFIG.aether = aether;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("aether", AetherItemSheet, {makeDefault: true});
});