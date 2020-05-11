"use strict";
let car = 'Benz';
const MasterSpark = class MasterSpark {
    constructor(power = 1000, accu = 1000) {
        this.power = power;
        this.accuTime = accu;
    }
    burn(target) {
        target.burnWithEffects();
    }
};
//# sourceMappingURL=index.js.map