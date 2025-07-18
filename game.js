// game.js
import chalk from 'chalk';                   // 콘솔 색상 출력을 위한 라이브러리
import readlineSync from 'readline-sync';     // 동기식 키보드 입력 처리

// Player: 플레이어의 상태와 행동을 관리하는 클래스
class Player {
  constructor() {
    this.hp = 100;
    this.minAtk = 5;
    this.maxAtk = 10;
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * (this.maxAtk - this.minAtk + 1)) + this.minAtk;
    monster.hp -= damage;
    return damage;
  }
}

// Monster: 몬스터의 상태와 행동을 관리하는 클래스
class Monster {
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

// displayStatus: 현재 스테이지와 플레이어/몬스터 상태를 화면에 출력합니다.
// - stage: 현재 레벨
// - player: Player 인스턴스
// - monster: Monster 인스턴스
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`
=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 HP: ${player.hp.toFixed(1)} `) +
    chalk.redBright(`| 몬스터 HP: ${monster.hp.toFixed(1)} |`)
  );
  console.log(chalk.magentaBright(`=================================================
`));
}

// battle: 턴제 전투를 처리하는 비동기 함수
// - stage: 현재 레벨
// - player: Player 인스턴스 (공격 가능 여부, hp 관리)
// - monster: Monster 인스턴스 (hp 관리)
// 로그(logs)에 플레이어/몬스터 행동 이력을 저장하고 화면에 출력합니다.
const battle = async (stage, player, monster) => {
  let logs = [];

  // 플레이어 체력이 0 이상인 동안 반복
  while (player.hp > 0) {
    console.clear();               // 매 턴 화면 초기화
    displayStatus(stage, player, monster);  // 상태 출력

    // 이전 턴의 로그를 화면에 출력
    logs.forEach((log) => console.log(log));

    // 플레이어 행동 선택지 출력
    console.log(
      chalk.green(`
1. 공격한다 2. 연속공격 (${player.multiAttackChance}%) 3. 방어한다 (${player.defenseChance}%) 4. 도망친다 (${player.escapeChance}%)`)
    );
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === '1') {
      const playerDamage = player.attack(monster);
      logs.push(chalk.yellow(`플레이어가 몬스터에게 ${playerDamage}의 데미지를 입혔습니다.`));

      if (monster.hp <= 0) {
        logs.push(chalk.green('몬스터를 물리쳤습니다!'));
        break; // 전투 종료
      }

      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    } else if (choice === '2') {
      const multiAttackSuccess = Math.random() * 100 < player.multiAttackChance;
      if (multiAttackSuccess) {
        const firstDamage = player.attack(monster);
        logs.push(chalk.yellow(`플레이어가 몬스터에게 ${firstDamage}의 데미지를 입혔습니다. (연속공격)`));
        if (monster.hp > 0) {
          const secondDamage = player.attack(monster);
          logs.push(chalk.yellow(`플레이어가 몬스터에게 ${secondDamage}의 데미지를 입혔습니다. (연속공격)`));
        }
      } else {
        logs.push(chalk.red('연속공격에 실패했습니다...'));
      }

      if (monster.hp <= 0) {
        logs.push(chalk.green('몬스터를 물리쳤습니다!'));
        break; // 전투 종료
      }

      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    } else if (choice === '3') {
      const defenseSuccess = Math.random() * 100 < player.defenseChance;
      if (defenseSuccess) {
        logs.push(chalk.green('방어에 성공했습니다!'));
        const counterDamage = Math.floor(player.maxAtk * 0.5); // 최대 공격력의 50%로 반격
        monster.hp -= counterDamage;
        logs.push(chalk.yellow(`몬스터에게 ${counterDamage}의 반격 데미지를 입혔습니다.`));
      } else {
        logs.push(chalk.red('방어에 실패했습니다...'));
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    } else if (choice === '4') {
      const escapeSuccess = Math.random() * 100 < player.escapeChance;
      if (escapeSuccess) {
        logs.push(chalk.green('성공적으로 도망쳤습니다!'));
        return; // 전투 즉시 종료
      } else {
        logs.push(chalk.red('도망에 실패했습니다...'));
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    }
  }
  if (player.hp <= 0) {    logs.push(chalk.red.bold('\nGAME OVER'));    logs.push(chalk.yellow('당신은 몬스터에게 패배했습니다...'));    return; // 전투 종료  };

// startGame: 전체 게임 흐름 제어 함수
export async function startGame() {
  console.clear();
  const player = new Player();  // 플레이어 생성
  let stage = 1;

  // 스테이지 1부터 10까지 반복
  while (stage <= 10) {
    const monster = new Monster(stage);  // 새로운 몬스터 생성
    await battle(stage, player, monster); // 전투 진행

    if (player.hp > 0) {
      console.log(chalk.green(`Stage ${stage} 클리어!`));
      const recoveredHp = Math.floor(player.hp * 0.3); // 남은 체력의 30% 회복
      player.hp += recoveredHp;
      console.log(chalk.blue(`체력을 ${recoveredHp}만큼 회복했습니다.`));
      readlineSync.question('다음 스테이지로 가려면 엔터를 누르세요...');
    } else {
      console.log(chalk.red('유 다이. 게임 오버!'));
      break; // 게임 루프 종료
    }

    stage++;
  }
  if (stage > 10) {
    console.log(chalk.cyan.bold('\nCONGRATULATIONS!'));
    console.log(chalk.yellow('모든 몬스터를 물리치고 게임에서 승리했습니다!'));
    console.log(chalk.magentaBright('\n=== 최종 능력치 ==='));
    console.log(chalk.blue(`HP: ${player.hp.toFixed(1)}`));
    console.log(chalk.blue(`공격력: ${player.minAtk}~${player.maxAtk}`));
    console.log(chalk.blue(`도망 확률: ${player.escapeChance}%`));
    console.log(chalk.blue(`연속 공격 확률: ${player.multiAttackChance}%`));
    console.log(chalk.blue(`방어 확률: ${player.defenseChance}%`));
  }
  // TODO: 최종 클리어 메시지 또는 패배 메시지 출력
}