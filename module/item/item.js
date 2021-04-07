/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class AetherItem extends Item {
  
  chatTemplate = {
    "firearm": "systems/aether/templates/item/chat/firearm-chat.hbs",
    "melee": "systems/aether/templates/item/chat/melee-chat.hbs",
    "armor": "systems/aether/templates/item/chat/armor-chat.hbs",
    "ammunition": "systems/aether/templates/item/chat/ammunition-chat.hbs",
    "skill": "systems/aether/templates/item/chat/skill-chat.hbs",
    "scar": "systems/aether/templates/item/chat/scar-chat.hbs",
    "spell": "systems/aether/templates/item/chat/spell-chat.hbs",
    "item": "systems/aether/templates/item/chat/item-chat.hbs",
  }
  
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    };
    let cardData = {
      ...this.data,
      owner: this.actor.id
    };

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
    chatData.roll = true;

    return ChatMessage.create(chatData);
  }
}
