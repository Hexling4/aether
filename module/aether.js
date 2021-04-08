// Import Modules
import {Aether} from "./config.js";
import { AetherActor } from "./actor/actor.js";
import { AetherActorSheet } from "./actor/actor-sheet.js";
import { AetherItem } from "./item/item.js";
import { AetherItemSheet } from "./item/item-sheet.js";
import * as Chat from "./chat.js";
import { recoil } from './dice.js';

async function preloadHandlebarsTemplates () {
  const templatePaths = [
    "systems/aether/templates/actor/partials/skill-card.hbs",
    "systems/aether/templates/actor/partials/firearm-card.hbs",
    "systems/aether/templates/actor/partials/item-card.hbs",
    "systems/aether/templates/actor/partials/armor-card.hbs",
    "systems/aether/templates/actor/partials/melee-card.hbs",
    "systems/aether/templates/actor/partials/wound-card.hbs",
    "systems/aether/templates/actor/partials/ammunition-card.hbs",
    "systems/aether/templates/actor/partials/container-card.hbs",
  ];

  return loadTemplates(templatePaths);
}

Hooks.once('init', async function() {
  console.log("aether | Initializing the Aether system.");

  CONFIG.aether = Aether;

  game.aether = {
    AetherActor,
    AetherItem,
    rollItemMacro
  };

  

  // Define custom Entity classes
  CONFIG.Actor.entityClass = AetherActor;
  CONFIG.Item.entityClass = AetherItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("aether", AetherActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("aether", AetherItemSheet, { makeDefault: true });

  // Register custom Die modifier
  Die.MODIFIERS.re = recoil;

  preloadHandlebarsTemplates();

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('ember', function() {

  });
});

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createAetherMacro(data, slot));
});

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createAetherMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.aether.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "aether.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}