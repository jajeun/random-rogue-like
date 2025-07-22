// monster.js
export class Monster {
  constructor(stage) {
    this.hp = 80 + stage * 20; // 스테이지에 따라 체력 증가
    this.minAtk = 3 + stage * 1; // 스테이지에 따라 최소 공격력 증가 (밸런스 조정)
    this.maxAtk = 6 + stage * 2; // 스테이지에 따라 최대 공격력 증가 (밸런스 조정)
  }

  attack(player) {
    const damage = Math.floor(Math.random() * (this.maxAtk - this.minAtk + 1)) + this.minAtk;
    player.hp -= damage;
    return damage;
  }
}
