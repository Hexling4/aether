import * as Dice from "../dice.js"

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class AetherActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["aether", "sheet", "actor"],
      template: "systems/aether/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];

    data.config = CONFIG.aether;

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    } else if (this.actor.data.type == 'container') {
      this._prepareContainerItems(data);
    }

    return data;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const items = [];
    const armor = [];
    const firearms = [];
    const melee = [];
    const features = [];
    const spells = [];
    const skills = [];
    const wounds = [];
    const ammunition = [];
    const containers = [];

    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to items.
      if (i.type === 'item') {
        items.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        spells.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        skills.push(i);
      }
      // Append to firearms.
      else if (i.type === 'firearm') {
        firearms.push(i);
      }
      // Append to armor.
      else if (i.type === 'armor') {
        armor.push(i);
      }
      // Append to melee.
      else if (i.type === 'melee') {
        melee.push(i);
      }
      // Append to wounds.
      else if (i.type === 'wound') {
        wounds.push(i);
      }
      // Append to ammunition.
      else if (i.type === 'ammunition') {
        ammunition.push(i);
      }
      // Append to containers.
      else if (i.type === 'container') {
        containers.push(i);
      }
    }

    // Assign and return
    actorData.items = items;
    actorData.features = features;
    actorData.spells = spells;
    actorData.skills = skills;
    actorData.firearms = firearms;
    actorData.armor = armor;
    actorData.melee = melee;
    actorData.wounds = wounds;
    actorData.ammunition = ammunition;
    actorData.containers = containers;
  }

  _prepareContainerItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const gear = [];

    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item' || i.type === 'firearm' || i.type === 'armor' || i.type === 'ammunition' || i.type === 'melee') {
        gear.push(i);
      }
    }

    // Assign and return
    actorData.gear = gear;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    //Edit Skills
    html.find('.skill-edit').change(this._onItemChange.bind(this));
    html.find('.skill-check').click(this._onItemCheck.bind(this));

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const td = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(td.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const td = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(td.data("itemId"));
      td.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('tr.item').each((i, tr) => {
        if (tr.classList.contains("inventory-header")) return;
        tr.setAttribute("draggable", true);
        tr.addEventListener("dragstart", handler, false);
      });
    }

    // Owner permissions
    if (this.actor.owner) {
      html.find('.item-show').click(this._onItemShow.bind(this));
      html.find('.item-roll').click(this._onItemRoll.bind(this));
      html.find('.item-improve').click(this._onItemImprove.bind(this));
      html.find('.terror-check').click(this._onTerrorCheck.bind(this));
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  // Handle Skill Edits
  _onItemChange(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.getOwnedItem(itemId);
    let field = element.dataset.field;

    console.log("aether | " + element.value);
    return item.update({ [field]: element.value });
  }

  _onItemCheck(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.getOwnedItem(itemId);
    let field = element.dataset.field;

    console.log("aether | " + field + " " + element.checked);
    return item.update({ [field]: element.checked });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  _onItemShow(event) {
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemID);

    item.roll();
  }

  _onItemRoll(event) {
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    let abil = item.data.data.ability;
    let ability = this.actor.data.data.abilities[abil].mod;
    let mobility = this.actor.data.data.mob;
    let pain = this.actor.data.data.global.pain;
    let penalty = this.actor.data.data.weightPen;
    let rollFormula = "";
    let rollData = {
      actionValue: item.data.data.value,
      actionAbility: ability,
      actionMobility: mobility,
      actionPain: pain,
      actionPenalty: penalty
    }
    let messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: item.name + " check"
    }

    if (item.data.data.mobility && item.data.data.pain) {
      rollFormula = "1d20 + @actionValue + @actionAbility + @actionMobility - @actionPain - @actionPenalty";
    } else if (item.data.data.pain && !item.data.data.mobility) {
      rollFormula = "1d20 + @actionValue + @actionAbility - @actionPain";
    } else if (item.data.data.mobility && !item.data.data.pain) {
      rollFormula = "1d20 + @actionValue + @actionAbility + @actionMobility - @actionPenalty";
    } else {
      rollFormula = "1d20 + @actionValue + @actionAbility";
    }
    
    new Roll(rollFormula, rollData).roll().toMessage(messageData);
  }

  _onItemImprove(event) {
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    let rollData = {
      currentValue: item.data.data.value
    }
    let rollFormula = "1d10cs>@currentValue";
    let messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: item.name
    }

    new Roll(rollFormula, rollData).roll().toMessage(messageData);
  }

  _onTerrorCheck(event) {
    let rollData = {
      currentTerror: this.actor.data.data.terror.value
    }
    let rollFormula = "1d100cs>@currentTerror";
    let messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: "Terror Check"
    }

    new Roll(rollFormula,rollData).roll().toMessage(messageData);
  }
}
