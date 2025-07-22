import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { playMathPuzzle } from './mathPuzzle.js';
import { Player } from './player.js';
import { Monster } from './monster.js';
import { battle } from './battle.js';


// startGame: 전체 게임 흐름 제어 함수
async function startGame() {
  console.clear();
  const player = new Player();  // 플레이어 생성
  let stage = 1;

  // 스테이지 1부터 10까지 반복
  while (stage <= 10) {
    const monster = new Monster(stage);  // 새로운 몬스터 생성
    const hpBeforeBattle = player.hp; // 전투 전 체력 저장
    await battle(stage, player, monster); // 전투 진행

    if (player.hp > 0) {
      console.log(chalk.green(`Stage ${stage} 클리어!`));
      const lostHp = hpBeforeBattle - player.hp; // 잃은 체력 계산
      readlineSync.question('다음 스테이지로 가려면 엔터를 누르세요...');
      await playMathPuzzle(player, lostHp);
    }
    else {
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

export { startGame };