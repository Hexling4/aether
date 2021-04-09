import * as Dice from "./dice.js"

export function addChatListeners (html) {
    //Skill Macros
    html.on('click', 'button.skill-roll', onSkillRoll);
    html.on('click', 'button.skill-rollMobility', onSkillRollMobility);

    //Weapon Macros
    html.on('click', 'button.hasty-shot', onHastyShot);
    html.on('click', 'button.careful-shot', onCarefulShot);
    //html.on('click', 'button.full-auto', onFullAuto);

    //Ammo Macros
    html.on('click', 'button.cqc-hit', onCqcHit);
    html.on('click', 'button.ranged-hit', onRangedHit);

    //Melee Macros
    html.on('click', 'button.attack', onAttack);
    html.on('click', 'button.attack-mobility', onAttackMobility);
    html.on('click', 'button.damage', onDamage);
}

// Skill Rolls
function onSkillRoll (event) {
    const card = event.currentTarget.closest(".item")
    let owner = game.actors.get(card.dataset.ownerId);
    let skill = owner.getOwnedItem(card.dataset.itemId);

    Dice.SkillCheck(skill, owner);
}

function onSkillRollMobility (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let skill = owner.getOwnedItem(card.dataset.itemId);

    Dice.SkillCheckMobility(skill, owner);
}

// Shot Types
function onHastyShot (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let weapon = owner.getOwnedItem(card.dataset.itemId);

    Dice.HastyShot(weapon, owner);
}
function onCarefulShot (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let weapon = owner.getOwnedItem(card.dataset.itemId);

    Dice.CarefulShot(weapon, owner);
}


// Hit Locations
function onCqcHit (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let ammo = owner.getOwnedItem(card.dataset.itemId);

    Dice.CqcHit(ammo, owner);
}
function onRangedHit (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let ammo = owner.getOwnedItem(card.dataset.itemId);

    Dice.RangedHit(ammo, owner);
}

// Melee
function onAttack (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let melee = owner.getOwnedItem(card.dataset.itemId);

    Dice.Attack(melee, owner);
}
function onAttackMobility (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let melee = owner.getOwnedItem(card.dataset.itemId);

    Dice.AttackMobility(melee, owner);
}
function onDamage (event) {
    const card = event.currentTarget.closest(".item");
    let owner = game.actors.get(card.dataset.ownerId);
    let melee = owner.getOwnedItem(card.dataset.itemId);

    Dice.Damage(melee, owner);
}