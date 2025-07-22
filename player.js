// player.js
export class Player {
  constructor() {
    this.hp = 100;
    this.minAtk = 5;
    this.maxAtk = 10;
    this.multiAttackChance = 33; // 연속 공격 확률
    this.defenseChance = 33;     // 방어 확률
    this.escapeChance = 10;      // 도망 확률
    this.monsterMaxObservedAtk = null; // 몬스터의 관찰된 최대 공격력
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * (this.maxAtk - this.minAtk + 1)) + this.minAtk;
    monster.hp -= damage;
    return damage;
  }
}
