export async function SkillCheck (skill, owner) {
    const messageTemplate = "systems/aether/templates/item/chat/skill-check.hbs"
    let abil = skill.data.data.ability;
    let ability = owner.data.data.abilities[abil].mod;
    let rollFormula = "";
    let rollData = {
        level: skill.data.data.value,
        ability: ability,
        mobility: owner.data.data.mob,
        pain: owner.data.data.global.pain,
        weight: owner.data.data.weightPen,
    }

    if (skill.data.data.pain) {
        rollFormula = "1d20 + @level + @ability - @pain"
    } else {
        rollFormula = "1d20 + @level + @ability"
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: skill.name + " check"
    }

    rollResult.toMessage(messageData);
}

export async function SkillCheckMobility (skill, owner) {
    const messageTemplate = "systems/aether/templates/item/chat/skill-check.hbs"
    let abil = skill.data.data.ability;
    let ability = owner.data.data.abilities[abil].mod;
    let rollFormula = "";
    let rollData = {
        level: skill.data.data.value,
        ability: ability,
        mobility: owner.data.data.mob,
        pain: owner.data.data.global.pain,
        weight: owner.data.data.weightPen,
    }

    if (skill.data.data.pain) {
        rollFormula = "1d20 + @level + @ability - @pain + @mobility - @weight"
    } else {
        rollFormula = "1d20 + @level + @ability + @mobility - @weight"
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: skill.name + " check"
    }

    rollResult.toMessage(messageData);
}

export async function HastyShot (weapon, owner, useLuck) {
    const messageTemplate = "systems/aether/templates/item/chat/hasty-shot.hbs"
    let skill = owner.data.data.eSkills.firearms;
    let mobility = owner.data.data.mob;
}