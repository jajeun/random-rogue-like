// battle.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayStatus } from './ui.js';

export const battle = async (stage, player, monster) => {
  let logs = [];
  let turn = 1; // 턴 번호 초기화

  // 플레이어 체력이 0 이상인 동안 반복
  while (player.hp > 0) {
    console.clear();               // 매 턴 화면 초기화
    displayStatus(stage, player, monster);  // 상태 출력

    // 이전 턴의 로그를 화면에 출력 (최대 10줄)
    logs.slice(-10).forEach((log) => console.log(log));

    // 플레이어 행동 선택지 출력
    console.log(
      chalk.green(`\r\n1. 공격한다 2. 연속공격 (${player.multiAttackChance}%) 3. 방어한다 (${player.defenseChance}%) 4. 도망친다 (${player.escapeChance}%)`)
    );
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === '1') {
      const playerDamage = player.attack(monster);
      logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${playerDamage}의 데미지를 입혔습니다.`));

      if (monster.hp <= 0) {
        logs.push(chalk.green(`#${turn} 몬스터를 물리쳤습니다!`));
        break; // 전투 종료
      }

      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    } else if (choice === '2') {
      const multiAttackSuccess = Math.random() * 100 < player.multiAttackChance;
      if (multiAttackSuccess) {
        const firstDamage = player.attack(monster);
        logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${firstDamage}의 데미지를 입혔습니다. (연속공격)`));
        if (monster.hp > 0) {
          const secondDamage = player.attack(monster);
          logs.push(chalk.yellow(`#${turn} 플레이어가 몬스터에게 ${secondDamage}의 데미지를 입혔습니다. (연속공격)`));
        }
      } else {
        logs.push(chalk.red(`#${turn} 연속공격에 실패했습니다...`));
      }

      if (monster.hp <= 0) {
        logs.push(chalk.green(`#${turn} 몬스터를 물리쳤습니다!`));
        break; // 전투 종료
      }

      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    } else if (choice === '3') {
      const defenseSuccess = Math.random() * 100 < player.defenseChance;
      if (defenseSuccess) {
        logs.push(chalk.green(`#${turn} 방어에 성공했습니다!`));
        const counterDamage = Math.floor(player.maxAtk * 0.5); // 최대 공격력의 50%로 반격
        monster.hp -= counterDamage;
        logs.push(chalk.yellow(`#${turn} 몬스터에게 ${counterDamage}의 반격 데미지를 입혔습니다.`));
      } else {
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`#${turn} 방어에 실패했습니다...`));
        logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    } else if (choice === '4') {
      const escapeSuccess = Math.random() * 100 < player.escapeChance;
      if (escapeSuccess) {
        logs.push(chalk.green(`#${turn} 성공적으로 도망쳤습니다!`));
        return; // 전투 즉시 종료
      } else {
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`#${turn} 도망에 실패했습니다...`));
        logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    }
    turn++; // 턴 증가
  }
  if (player.hp <= 0) {
    logs.push(chalk.red.bold('\nGAME OVER'));
    logs.push(chalk.yellow('당신은 몬스터에게 패배했습니다...'));
    return; // 전투 종료  
  }
};