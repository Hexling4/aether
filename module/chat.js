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
    //X

    //Melee Macros
    //X
}

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