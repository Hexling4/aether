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
    let level = parseInt(owner.data.data.eSkills.firearms) + parseInt(owner.data.data.mob) + parseInt(weapon.data.data.mobility) - parseInt(owner.data.data.weightPen);
    let rollFormula = "1d20re(@threshold - @level):@recoilNum";
    let rollData = {
        level: level,
        threshold: 10,
        recoilNum: weapon.data.data.recoil,
        dropRange: 0,
        opticRange: 0,
        burstRate: weapon.data.data.burstRate
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "fires a " + weapon.name
    }

    rollResult.toMessage(messageData);
}

export async function CarefulShot (weapon, owner, useLuck) {
    const messageTemplate = "systems/aether/templates/item/chat/hasty-shot.hbs"
    let level = parseInt(owner.data.data.eSkills.firearms);
    let rollFormula = "1d20re(@threshold - @level):@recoilNum";
    let rollData = {
        level: level,
        threshold: 10,
        recoilNum: weapon.data.data.recoil,
        dropRange: 0,
        opticRange: 0,
        burstRate: weapon.data.data.burstRate
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "fires a " + weapon.name
    }

    rollResult.toMessage(messageData);
}

export async function CqcHit (ammo, owner) {
    // Set up dice variables
    let damage = ammo.data.data.damage;
    let pierce = parseInt(ammo.data.data.pierce);
    let targetActor;
    let targetToken = game.users.current.targets;
    targetToken.forEach(function(actor) {
        targetActor = actor.actor;
    })
    let armor = 0;
    let rollFormula = "@damage - @penetrationFactor";

    // Random Hit Location
    let min = 1;
    let max = 20;
    let hitDie = Math.ceil(Math.random() * (max - min) + min);
    let hitLocation = "";
    //hitDie = 20;
    if (hitDie >= 20) {
        hitLocation = "face";
        armor = targetActor.data.data.head.face;
    } else if (hitDie <= 19 && hitDie >= 14) {
        hitLocation = "chest";
        armor = targetActor.data.data.chest.armor;
    } else if (hitDie <= 13 && hitDie >= 9) {
        hitLocation = "stomach";
        armor = targetActor.data.data.stomach.armor;
    } else if (hitDie <= 8 && hitDie >= 7) {
        hitLocation = "left arm";
        armor = targetActor.data.data.leftArm.armor;
    } else if (hitDie <= 6 && hitDie >= 5) {
        hitLocation = "right arm";
        armor = targetActor.data.data.rightArm.armor;
    } else if (hitDie <= 4 && hitDie >= 3) {
        hitLocation = "left leg";
        armor = targetActor.data.data.leftLeg.armor;
    } else if (hitDie <= 2 && hitDie >= 1) {
        hitLocation = "right leg";
        armor = targetActor.data.data.rightLeg.armor;
    }

    // Calculate penetration
    let penetrationFactor = armor - pierce;

    if (penetrationFactor < 0) {
        penetrationFactor = 0;
    }

    // Roll stuff
    let rollData = {
        damage: damage,
        penetrationFactor: penetrationFactor
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "hits the " + hitLocation + " with " + ammo.name
    }

    rollResult.toMessage(messageData);
}

export async function RangedHit (ammo, owner) {
    // Set up dice variables
    let damage = ammo.data.data.damage;
    let pierce = parseInt(ammo.data.data.pierce);
    let targetActor;
    let targetToken = game.users.current.targets;
    targetToken.forEach(function(actor) {
        targetActor = actor.actor;
    })
    let armor = 0;
    let rollFormula = "@damage - @penetrationFactor";

    // Random Hit Location
    let min = 1;
    let max = 20;
    let hitDie = Math.ceil(Math.random() * (max - min) + min);
    let hitLocation = "";
    //hitDie = 20;
    if (hitDie >= 20) {
        hitLocation = "head";
        armor = targetActor.data.data.head.armor;
    } else if (hitDie <= 19 && hitDie >= 14) {
        hitLocation = "chest";
        armor = targetActor.data.data.chest.armor;
    } else if (hitDie <= 13 && hitDie >= 9) {
        hitLocation = "stomach";
        armor = targetActor.data.data.stomach.armor;
    } else if (hitDie <= 8 && hitDie >= 7) {
        hitLocation = "left arm";
        armor = targetActor.data.data.leftArm.armor;
    } else if (hitDie <= 6 && hitDie >= 5) {
        hitLocation = "right arm";
        armor = targetActor.data.data.rightArm.armor;
    } else if (hitDie <= 4 && hitDie >= 3) {
        hitLocation = "left leg";
        armor = targetActor.data.data.leftLeg.armor;
    } else if (hitDie <= 2 && hitDie >= 1) {
        hitLocation = "right leg";
        armor = targetActor.data.data.rightLeg.armor;
    }

    // Calculate penetration
    let penetrationFactor = armor - pierce;

    if (penetrationFactor < 0) {
        penetrationFactor = 0;
    }

    // Roll stuff
    let rollData = {
        damage: damage,
        penetrationFactor: penetrationFactor
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "hits the " + hitLocation + " with " + ammo.name
    }

    rollResult.toMessage(messageData);
}

// Melee
export async function Attack (melee, owner) {
    let bonus;
    let skill = melee.data.data.attackWith;
    let targetActor;
    let targetToken = game.users.current.targets;
    targetToken.forEach(function(actor) {
        targetActor = actor.actor;
    })
    let dodge = targetActor.data.data.eSkills.dodge;

    if (skill === "blades") {
        bonus = owner.data.data.eSkills.blades;
    } else if (skill === "axes") {
        bonus = owner.data.data.eSkills.axes;
    } else if (skill === "clubs") {
        bonus = owner.data.data.eSkills.clubs;
    } else if (skill === "fists") {
        bonus = owner.data.data.eSkills.fists;
    } else if (skill === "polearms") {
        bonus = owner.data.data.eSkills.polearms;
    } else if (skill === "whips") {
        bonus = owner.data.data.eSkills.whips;
    }

    let rollFormula = "1d20cs>(@dodge - @bonus)";
    let rollData = {
        bonus: bonus,
        dodge: dodge
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "attacks with " + melee.name
    }

    rollResult.toMessage(messageData);
}

export async function AttackMobility (melee, owner) {
    let bonus;
    let skill = melee.data.data.attackWith;
    let mobility = parseInt(owner.data.data.mob) + parseInt(melee.data.data.mobility);
    let targetActor;
    let targetToken = game.users.current.targets;
    targetToken.forEach(function(actor) {
        targetActor = actor.actor;
    })
    let dodge = targetActor.data.data.eSkills.dodge;

    if (skill === "blades") {
        bonus = owner.data.data.eSkills.blades;
    } else if (skill === "axes") {
        bonus = owner.data.data.eSkills.axes;
    } else if (skill === "clubs") {
        bonus = owner.data.data.eSkills.clubs;
    } else if (skill === "fists") {
        bonus = owner.data.data.eSkills.fists;
    } else if (skill === "polearms") {
        bonus = owner.data.data.eSkills.polearms;
    } else if (skill === "whips") {
        bonus = owner.data.data.eSkills.whips;
    }

    let rollFormula = "1d20cs>(@dodge - @bonus - @mobility)";
    let rollData = {
        bonus: bonus,
        dodge: dodge,
        mobility: mobility
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "attacks with " + melee.name
    }

    rollResult.toMessage(messageData);
}

export async function Damage (melee, owner) {
    // Set up dice variables
    let damage = melee.data.data.damage;
    let pierce = parseInt(melee.data.data.pierce);
    let shred = melee.data.data.shred;
    let targetActor;
    let targetToken = game.users.current.targets;
    targetToken.forEach(function(actor) {
        targetActor = actor.actor;
    })
    let armor = 0;
    let rollFormula = "@damage - @penetrationFactor";
    let shredFormula = "@shred"

    // Random Hit Location
    let min = 1;
    let max = 20;
    let hitDie = Math.ceil(Math.random() * (max - min) + min);
    let hitLocation = "";
    //hitDie = 20;
    if (hitDie >= 20) {
        hitLocation = "head";
        armor = targetActor.data.data.head.armor;
    } else if (hitDie <= 19 && hitDie >= 14) {
        hitLocation = "chest";
        armor = targetActor.data.data.chest.armor;
    } else if (hitDie <= 13 && hitDie >= 9) {
        hitLocation = "stomach";
        armor = targetActor.data.data.stomach.armor;
    } else if (hitDie <= 8 && hitDie >= 7) {
        hitLocation = "left arm";
        armor = targetActor.data.data.leftArm.armor;
    } else if (hitDie <= 6 && hitDie >= 5) {
        hitLocation = "right arm";
        armor = targetActor.data.data.rightArm.armor;
    } else if (hitDie <= 4 && hitDie >= 3) {
        hitLocation = "left leg";
        armor = targetActor.data.data.leftLeg.armor;
    } else if (hitDie <= 2 && hitDie >= 1) {
        hitLocation = "right leg";
        armor = targetActor.data.data.rightLeg.armor;
    }

    // Calculate penetration
    let penetrationFactor = armor - pierce;

    if (penetrationFactor < 0) {
        penetrationFactor = 0;
    }

    // Roll stuff
    let rollData = {
        damage: damage,
        penetrationFactor: penetrationFactor
    }
    let shredData = {
        shred:shred
    }

    let roll = new Roll(rollFormula, rollData);
    let rollResult = roll.roll();
    let shredRoll = new Roll(shredFormula, shredData);
    let shredResult = shredRoll.roll();

    let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "hits the " + hitLocation + " with " + melee.name
    }
    let shredMessage = {
        speaker: ChatMessage.getSpeaker({ actor: owner }),
        flavor: "deals shred damage with " + melee.name
    }

    rollResult.toMessage(messageData);
    shredResult.toMessage(shredMessage);
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
