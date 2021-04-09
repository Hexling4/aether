/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class AetherActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    if (actorData.type === 'character' || actorData.type === 'beast') this._prepareCharacterData(actorData);
    if (actorData.type === 'container') this._prepareContainerData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      if (ability != "mov" || ability != "luk") {
        // Calculate the modifier using d20 rules.
        if (ability.value >= 10) {
          ability.mod = Math.floor((ability.value - 10) / 2);
        } else {
          ability.mod = Math.ceil((ability.value - 10) / 2);
        }
      }
    }

    // Calculate health data
    this._calculateBleed();
    this._calculatePain();
    this._calculateLimp();

    // Calculate weight and space.
    this._calculateArmorWeight();
    this._calculateFirearmWeight();
    this._calculateAmmoWeight();
    this._calculateMeleeWeight();
    this._calculateItemWeight();
    this._calculateContainerWeight();
    data.weight = Math.ceil(data.weight * 100) / 100;

    // Calculate armor
    this._calculateBodyArmor();
    this._calculateChestArmor();
    this._calculateStomachArmor();
    this._calculateArmArmor();
    this._calculateLegArmor();
    this._calculateHeadArmor();
    this._calculateFaceArmor();
    this._calculateFullArmor();

    if (data.weight <= data.abilities.str.value) {
      data.load = "Light";
      data.weightPen = 0;
    } else if (data.weight <= data.abilities.str.value * 2 && data.weight > data.abilities.str.value) {
      data.load = "Medium";
      data.weightPen = 1;
    } else if (data.weight <= data.abilities.str.value * 4 && data.weight > data.abilities.str.value * 2) {
      data.load = "Heavy";
      data.weightPen = 2;
    } else if (data.weight > data.abilities.str.value * 4) {
      data.load = "Overburdened";
      data.weightPen = 4;
    }

    // Calculate HP and Aura, assign life value.
    data.health.max = Math.ceil(data.abilities.con.value / 2) + Math.ceil(data.abilities.siz.value / 2);
    data.aura.max = data.abilities.wil.value + data.aspects.forge.value;
    //data.life.max = data.abilities.con.value * 2;
    this._calculateLife();

    // Calculate MOV.
    if (data.abilities.str.value < data.abilities.siz.value && data.abilities.dex.value < data.abilities.siz.value) {
      data.abilities.mov.value = 7 - data.global.limp - data.weightPen;
    } else if (data.abilities.str.value >= data.abilities.siz.value && data.abilities.dex.value >= data.abilities.siz.value) {
      data.abilities.mov.value = 9 - data.global.limp - data.weightPen;
    } else {
      data.abilities.mov.value = 8 - data.global.limp - data.weightPen;
    }

    // Assign essential skills.
    this._calculateInitiative();
    this._calculateFirearms();
    this._calculateBlades();
    this._calculatePolearms();
    this._calculateWhips();
    this._calculateDodge();

    /**
    * Set an initiative formula for the system
    * @type {String}
    */
    CONFIG.Combat.initiative = {
      formula: "1d20 + " + this.data.data.eSkills.initiative,
      decimals: 2
    };
  }

  _prepareContainerData(actorData) {
    const data = actorData.data;

    // Calculate weight and space.
    this._calculateArmorWeight();
    this._calculateFirearmWeight();
    this._calculateAmmoWeight();
    this._calculateMeleeWeight();
    this._calculateItemWeight();
    this._calculateContainerWeight();
    data.weight = Math.ceil(data.weight * 100) / 100;
  }

  // eSkill calculations.
  _calculateLife() {
    const lifeSkill = this.items.filter((i) => i.name === "Life");
    lifeSkill.forEach((skill) => { this.data.data.life.max = parseInt(this.data.data.abilities.con.value) + parseInt(skill.data.data.value); });
  }
  _calculateInitiative() {
    const initiativeSkill = this.items.filter((i) => i.name === "Initiative");
    initiativeSkill.forEach((skill) => { this.data.data.eSkills.initiative = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value) - parseInt(this.data.data.global.pain) - parseInt(this.data.data.weightPen) + parseInt(this.data.data.mob); });
  }
  _calculateFirearms() {
    const firearmsSkill = this.items.filter((i) => i.name === "Firearms");
    firearmsSkill.forEach((skill) => { this.data.data.eSkills.firearms = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value); });
  }
  _calculateAxes() {
    const axesSkill = this.items.filter((i) => i.name === "Axes");
    axesSkill.forEach((skill) => { this.data.data.eSkills.axes = parseInt(this.data.data.abilities.str.mod) + parseInt(skill.data.data.value); });
  }
  _calculateBlades() {
    const bladesSkill = this.items.filter((i) => i.name === "Blades");
    bladesSkill.forEach((skill) => { this.data.data.eSkills.blades = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value); });
  }
  _calculateClubs() {
    const clubsSkill = this.items.filter((i) => i.name === "Clubs");
    clubsSkill.forEach((skill) => { this.data.data.eSkills.clubs = parseInt(this.data.data.abilities.str.mod) + parseInt(skill.data.data.value); });
  }
  _calculateFists() {
    const fistsSkill = this.items.filter((i) => i.name === "Fists");
    fistsSkill.forEach((skill) => { this.data.data.eSkills.fists = parseInt(this.data.data.abilities.str.mod) + parseInt(skill.data.data.value); });
  }
  _calculatePolearms() {
    const polearmsSkill = this.items.filter((i) => i.name === "Polearms");
    polearmsSkill.forEach((skill) => { this.data.data.eSkills.polearms = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value); });
  }
  _calculateWhips() {
    const whipsSkill = this.items.filter((i) => i.name === "Whips");
    whipsSkill.forEach((skill) => { this.data.data.eSkills.whips = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value); });
  }
  _calculateDodge() {
    const dodgeSkill = this.items.filter((i) => i.name === "Dodge");
    dodgeSkill.forEach((skill) => { this.data.data.eSkills.dodge = parseInt(this.data.data.abilities.dex.mod) + parseInt(skill.data.data.value) + 5; });
  }

  // Calculate health properties.
  _calculateBleed() {
    const bleeding = this.items.filter((i) => i.type === "wound");
    bleeding.forEach((wound) => { this.data.data.global.bleed += parseFloat(wound.data.data.bleed); });
  }
  _calculatePain() {
    const inPain = this.items.filter((i) => i.type === "wound");
    inPain.forEach((wound) => { this.data.data.global.pain += parseInt(wound.data.data.pain); });
  }
  _calculateLimp() {
    const limping = this.items.filter((i) => i.type === "wound");
    limping.forEach((wound) => { this.data.data.global.limp += parseInt(wound.data.data.limp); });
  }

  // Calculate weight and encumberance
  _calculateItemWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "item" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) * parseInt(item.data.data.quantity) });
    equippedWeight.forEach((item) => { this.data.data.space.value += parseFloat(item.data.data.space) * parseInt(item.data.data.quantity) });
  }
  _calculateArmorWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "armor" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) });
    equippedWeight.forEach((item) => { this.data.data.mob += parseFloat(item.data.data.mobility) });
    equippedWeight.forEach((item) => { this.data.data.space.value += parseFloat(item.data.data.space) * parseInt(item.data.data.quantity) });
  }
  _calculateFirearmWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "firearm" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) });
    equippedWeight.forEach((item) => { this.data.data.space.value += parseFloat(item.data.data.space) * parseInt(item.data.data.quantity) });
  }
  _calculateAmmoWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "ammunition" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) * parseInt(item.data.data.bullets.value) });
    equippedWeight.forEach((item) => { this.data.data.space.value += parseFloat(item.data.data.space) });
  }
  _calculateMeleeWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "melee" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) });
    equippedWeight.forEach((item) => { this.data.data.space.value += parseFloat(item.data.data.space) * parseInt(item.data.data.quantity) });
  }
  _calculateContainerWeight() {
    const equippedWeight = this.items.filter((i) => i.type === "container" && i.data.data.equipped);
    equippedWeight.forEach((item) => { this.data.data.weight += parseFloat(item.data.data.weight) * parseFloat(item.data.data.loadRatio) });
    equippedWeight.forEach((item) => { this.data.data.mob += parseFloat(item.data.data.mobility) });
  }

  // Calculate armor
  _calculateBodyArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "body");
    headArmor.forEach((item) => { this.data.data.chest.armor = parseInt(item.data.data.protection) });
    headArmor.forEach((item) => { this.data.data.stomach.armor = parseInt(item.data.data.protection) });
  }
  _calculateChestArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "chest");
    headArmor.forEach((item) => { this.data.data.chest.armor = parseInt(item.data.data.protection) });
  }
  _calculateStomachArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "stomach");
    headArmor.forEach((item) => { this.data.data.stomach.armor = parseInt(item.data.data.protection) });
  }
  _calculateArmArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "arms");
    headArmor.forEach((item) => { this.data.data.leftArm.armor = parseInt(item.data.data.protection) });
    headArmor.forEach((item) => { this.data.data.rightArm.armor = parseInt(item.data.data.protection) });
  }
  _calculateLegArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "legs");
    headArmor.forEach((item) => { this.data.data.leftLeg.armor = parseInt(item.data.data.protection) });
    headArmor.forEach((item) => { this.data.data.rightLeg.armor = parseInt(item.data.data.protection) });
  }
  _calculateHeadArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "head");
    headArmor.forEach((item) => { this.data.data.head.armor = parseInt(item.data.data.protection) });
  }
  _calculateFaceArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "face");
    headArmor.forEach((item) => { this.data.data.head.face = parseInt(item.data.data.protection) });
  }
  _calculateFullArmor() {
    const headArmor = this.items.filter((i) => i.type === "armor" && i.data.data.coverage === "fullHead");
    headArmor.forEach((item) => { this.data.data.head.face = parseInt(item.data.data.protection) });
    headArmor.forEach((item) => { this.data.data.head.armor = parseInt(item.data.data.protection) });
  }
}