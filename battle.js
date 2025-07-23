// battle.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayStatus } from './ui.js';

export const battle = async (stage, player, monster) => {
  let logs = [];
  let turn = 1; // 턴 번호 초기화

  // [수정] 플레이어와 몬스터 모두의 HP가 0보다 클 때만 전투를 계속합니다.
  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.slice(-10).forEach((log) => console.log(log));

    console.log(
      chalk.green(`
1. 공격한다 2. 연속공격 (${player.multiAttackChance}%) 3. 방어한다 (${player.defenseChance}%) 4. 도망친다 (${player.escapeChance}%)`)
    );
    const choice = readlineSync.question('당신의 선택은? ');

    let monsterTurnFollows = true; // 플레이어 행동 후 몬스터가 공격할지 여부

    // --- 플레이어 턴 ---
    switch (choice) {
      case '1': { // 공격
        const playerDamage = player.attack(monster);
        logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${playerDamage}의 데미지를 입혔습니다.`));
        break;
      }
      case '2': { // 연속 공격
        const multiAttackSuccess = Math.random() * 100 < player.multiAttackChance;
        if (multiAttackSuccess) {
          const firstDamage = player.attack(monster);
          logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${firstDamage}의 데미지를 입혔습니다. (연속공격)`));
          if (monster.hp > 0) { // 첫 공격 후 몬스터가 살아있으면 추가 공격
            const secondDamage = player.attack(monster);
            logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${secondDamage}의 데미지를 입혔습니다. (연속공격)`));
          }
        } else {
          logs.push(chalk.red(`#${turn} 연속공격에 실패했습니다...`));
        }
        break;
      }
      case '3': { // 방어
        const defenseSuccess = Math.random() * 100 < player.defenseChance;
        if (defenseSuccess) {
          logs.push(chalk.green(`#${turn} 방어에 성공했습니다!`));
          const counterDamage = Math.floor(player.maxAtk * 0.5);
          monster.hp -= counterDamage;
          logs.push(chalk.yellow(`#${turn} 몬스터에게 ${counterDamage}의 반격 데미지를 입혔습니다.`));
          monsterTurnFollows = false; // [개선] 방어 성공 시 몬스터의 턴은 건너뜁니다.
        } else {
          logs.push(chalk.red(`#${turn} 방어에 실패했습니다...`));
        }
        break;
      }
      case '4': { // 도망
        const escapeSuccess = Math.random() * 100 < player.escapeChance;
        if (escapeSuccess) {
          logs.push(chalk.green(`#${turn} 성공적으로 도망쳤습니다!`));
          return; // 함수를 즉시 종료하여 전투를 끝냅니다.
        } else {
          logs.push(chalk.red(`#${turn} 도망에 실패했습니다...`));
        }
        break;
      }
      default: {
          logs.push(chalk.red('잘못된 선택입니다. 턴을 잃었습니다.'));
          break;
      }
    }

    // --- 몬스터 턴 ---
    // [개선] 몬스터가 살아있고, 플레이어의 행동(방어 성공 등)으로 턴을 건너뛰지 않을 때만 공격합니다.
    if (monster.hp > 0 && monsterTurnFollows) {
      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    }

    turn++;
  }

  // --- 전투 종료 후 결과 처리 ---
  // 마지막 상태를 한 번 더 보여주기 위해 화면을 정리하고 상태를 다시 출력합니다.
  console.clear();
  displayStatus(stage, player, monster);
  logs.forEach((log) => console.log(log)); // 모든 로그를 보여줍니다.

  if (monster.hp <= 0) {
    console.log(chalk.green.bold(`
#${turn} 몬스터를 물리쳤습니다!`));
  } else if (player.hp <= 0) {
    console.log(chalk.red.bold('\nGAME OVER'));
    console.log(chalk.yellow('당신은 몬스터에게 패배했습니다...'));
  }
};