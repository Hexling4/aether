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

/**
 * Explode the Die, rolling additional results for any values which are higher than the threshold.
 * With each explosion, the threshold gets increased by the specified amount.
 *
 * @param {string} modifier The matched modifier query
 */
export function recoil(modifier) {
    const rgx = /re([0-9]+):([0-9]+)/
    const match = modifier.match(rgx);
    if(!match) return this;
    const [initialThresholdString, increaseString] = match.slice(1);
    const initialThreshold = parseInt(initialThresholdString);
    const increase = parseInt(increaseString);

    // Recursively explode until there are no remaining results to explode
    let checked = 0;
    let currentThreshold = initialThreshold;
    while (checked < this.results.length) {
        let r = this.results[checked];
        checked++;
        if (!r.active) continue;

        // Determine whether to explode the result and roll again!
        if (r.result > currentThreshold) {
            r.exploded = true;
            this.roll();
            currentThreshold += increase;
        }

        if (checked > 1000) throw new Error("Maximum recursion depth for recoiling dice roll exceeded");
    }
}