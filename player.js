// player.js
export class Player {
  constructor() {
    this.hp = 200;
    this.minAtk = 10;
    this.maxAtk = 15;
    this.multiAttackChance = 33; // 연속 공격 확률
    this.defenseChance = 50;     // 방어 확률
    this.escapeChance = 10;      // 도망 확률
    this.monsterMaxObservedAtk = null; // 몬스터의 관찰된 최대 공격력
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * (this.maxAtk - this.minAtk + 1)) + this.minAtk;
    monster.hp -= damage;
    return damage;
  }
}
