// ui.js
import chalk from 'chalk';

// displayStatus: 현재 스테이지와 플레이어/몬스터 상태를 화면에 출력합니다.
// - stage: 현재 레벨
// - player: Player 인스턴스
// - monster: Monster 인스턴스
export function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`
=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 HP: ${player.hp.toFixed(1)} `) +
    chalk.redBright(`| 몬스터 HP: ${monster.hp.toFixed(1)} |`)
  );

  console.log(chalk.blue(`| 공격력: ${player.minAtk}~${player.maxAtk} `) +
              chalk.blue(`| 연속 공격 확률: ${player.multiAttackChance}% `) +
              chalk.blue(`| 방어 확률: ${player.defenseChance}% `) +
              chalk.blue(`| 도망 확률: ${player.escapeChance}% |`));
  console.log(chalk.magentaBright(`=================================================
`));
}
