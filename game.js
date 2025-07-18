// game.js
import chalk from 'chalk';                   // 콘솔 색상 출력을 위한 라이브러리
import readlineSync from 'readline-sync';     // 동기식 키보드 입력 처리

// Player: 플레이어의 상태와 행동을 관리하는 클래스
class Player {
  constructor() {
    this.hp = 100;
    this.minAtk = 5;
    this.maxAtk = 10;
    this.multiAttackChance = 33; // 연속 공격 확률
    this.defenseChance = 33;     // 방어 확률
    this.escapeChance = 10;      // 도망 확률
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

function generateTargetPuzzle() {
    // 1. 1-9 사이의 중복 없는 숫자 4개
    const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const numbers = [];
    while (numbers.length < 4) {
        const randomIndex = Math.floor(Math.random() * allNumbers.length);
        numbers.push(allNumbers.splice(randomIndex, 1)[0]);
    }

    // 2. 사칙연산에서 중복 없는 연산자 3개
    const allOperators = ['+', '-', '*', '/'];
    const operators = [];
    while (operators.length < 3) {
        const randomIndex = Math.floor(Math.random() * allOperators.length);
        operators.push(allOperators.splice(randomIndex, 1)[0]);
    }

    let currentNumbers = [...numbers];
    let targetNumber = 0;

    // 3. 스택 자료구조를 이용한 타겟 넘버 생성 (항상 해답이 존재하도록)
    // 숫자 배열에서 두 개를 뽑아 연산하고 다시 넣는 방식으로 구현
    for (let i = 0; i < 3; i++) { // 3개의 연산자를 사용
        if (currentNumbers.length < 2) {
            // 이 경우는 발생하지 않아야 하지만, 방어 코드
            return generateTargetPuzzle(); 
        }

        // 무작위로 두 숫자 선택
        const idx1 = Math.floor(Math.random() * currentNumbers.length);
        const num1 = currentNumbers.splice(idx1, 1)[0];
        const idx2 = Math.floor(Math.random() * currentNumbers.length);
        const num2 = currentNumbers.splice(idx2, 1)[0];

        // 사용 가능한 연산자 중 하나 선택 (이미 사용된 연산자는 제외)
        const op = operators[i]; // 연산자는 뽑힌 순서대로 사용

        let result;
        let validOperation = true;

        try {
            // eval을 사용하여 계산 (보안상 주의 필요)
            const tempExpression = `${num1} ${op} ${num2}`;
            result = eval(tempExpression);

            // 나눗셈 시 0으로 나누거나 결과가 무한대/NaN인 경우 유효하지 않음
            if (op === '/' && num2 === 0) {
                validOperation = false;
            } else if (!isFinite(result) || isNaN(result)) {
                validOperation = false;
            }
        } catch (e) {
            validOperation = false; // 수식 오류 등
        }

        if (!validOperation) {
            // 유효하지 않은 연산이면 퍼즐 재생성
            return generateTargetPuzzle();
        }

        currentNumbers.push(result); // 결과값을 다시 숫자 풀에 추가
    }

    targetNumber = currentNumbers[0]; // 최종 남은 숫자가 타겟 넘버

    return {
        numbers: numbers, // 원본 숫자 카드
        operators: operators, // 원본 연산자 카드
        targetNumber: targetNumber,
    };
}

async function playMathPuzzle(player) {
  console.log(chalk.yellowBright('\n--- 보너스 퍼즐: 연산 마스터 ---'));
  const puzzleData = generateTargetPuzzle();
  const numbers = puzzleData.numbers;
  const operators = puzzleData.operators;
  const targetNumber = puzzleData.targetNumber;

  console.log(chalk.yellow(`주어진 숫자와 연산자를 사용하여 목표 숫자 ${targetNumber}를 만드는 수식을 입력하세요!`));
  console.log(chalk.yellow('30초 안에 수식을 입력하세요. (예: 8 + 2 * 5 - 1) - 괄호 사용 불가!'));

  console.log(chalk.cyan(`\n숫자 카드: [${numbers.join(', ')}]`));
  console.log(chalk.cyan(`연산 카드: [${operators.join(', ')}]`));

  const startTime = Date.now();
  let puzzleResult = null;
  let inputValid = false;

  while (!inputValid) {
    const input = readlineSync.question('수식 입력: ');
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // 초 단위

    if (timeTaken > 30) {
      console.log(chalk.red('시간 초과! 퍼즐 실패. 아무것도 얻지 못했습니다.'));
      return; // 퍼즐 실패 시 함수 종료
    }

    // 괄호 사용 검사
    if (input.includes('(') || input.includes(')')) {
      console.log(chalk.red('괄호는 사용할 수 없습니다. 퍼즐 실패. 아무것도 얻지 못했습니다.'));
      return; // 괄호 사용 시 즉시 실패
    }

    try {
      puzzleResult = eval(input);
      if (typeof puzzleResult !== 'number' || !isFinite(puzzleResult)) {
        console.log(chalk.red('유효한 수식의 결과가 아닙니다. 퍼즐 실패. 아무것도 얻지 못했습니다.'));
        return; // 유효하지 않은 결과 시 즉시 실패
      } else {
        inputValid = true;
      }
    } catch (e) {
      console.log(chalk.red('잘못된 수식입니다. 퍼즐 실패. 아무것도 얻지 못했습니다.'));
      return; // 잘못된 수식 시 즉시 실패
    }
  }

  console.log(chalk.green(`당신이 입력한 수식의 결과: ${puzzleResult}`));

  let v = 0; // 보너스 계수
  if (puzzleResult === targetNumber) {
    console.log(chalk.green.bold('정답입니다! 완벽한 보너스를 얻습니다!'));
    v = 1.0; // 100% 보너스
  } else if (Math.abs(puzzleResult - targetNumber) <= 5) {
    console.log(chalk.yellow.bold('아쉽지만 근접했습니다! 부분 보너스를 얻습니다.'));
    v = 0.5; // 50% 보너스
  } else {
    console.log(chalk.red.bold('정답과 너무 멀리 떨어져 있습니다. 보너스 없음.'));
  }

  console.log(chalk.magenta(`계산된 보너스 계수 (v): ${v.toFixed(2)}`));

  if (v > 0) {
    console.log(chalk.yellow('\n어떤 능력치에 보너스를 적용하시겠습니까?'));
    console.log(chalk.blue('1. 남은 체력에 적용 (HP * (1 + v))'));
    console.log(chalk.blue('2. 공격력에 적용 (ATK * (1 + v))'));

    let choiceValid = false;
    let statChoice = '';
    while (!choiceValid) {
      statChoice = readlineSync.question('선택 (1 또는 2): ');
      if (statChoice === '1' || statChoice === '2') {
        choiceValid = true;
      } else {
        console.log(chalk.red('1 또는 2를 입력해주세요.'));
      }
    }

    if (statChoice === '1') {
      const oldHp = player.hp;
      player.hp = player.hp * (1 + v);
      console.log(chalk.green(`체력이 ${oldHp.toFixed(1)}에서 ${player.hp.toFixed(1)}로 증가했습니다!`));
    } else { // statChoice === '2'
      const oldMinAtk = player.minAtk;
      const oldMaxAtk = player.maxAtk;
      player.minAtk = player.minAtk * (1 + v);
      player.maxAtk = player.maxAtk * (1 + v);
      console.log(chalk.green(`공격력이 ${oldMinAtk.toFixed(1)}~${oldMaxAtk.toFixed(1)}에서 ${player.minAtk.toFixed(1)}~${player.maxAtk.toFixed(1)}로 증가했습니다!`));
    }
  } else {
    console.log(chalk.red('보너스를 얻지 못했습니다.'));
  }
  readlineSync.question('보너스 적용 완료! 다음으로 진행하려면 엔터를 누르세요...');
}



// battle: 턴제 전투를 처리하는 비동기 함수
// - stage: 현재 레벨
// - player: Player 인스턴스 (공격 가능 여부, hp 관리)
// - monster: Monster 인스턴스 (hp 관리)
// 로그(logs)에 플레이어/몬스터 행동 이력을 저장하고 화면에 출력합니다.
const battle = async (stage, player, monster) => {
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
      chalk.green(`
1. 공격한다 2. 연속공격 (${player.multiAttackChance}%) 3. 방어한다 (${player.defenseChance}%) 4. 도망친다 (${player.escapeChance}%)`)
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
        logs.push(chalk.red(`#${turn} 방어에 실패했습니다...`));
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    } else if (choice === '4') {
      const escapeSuccess = Math.random() * 100 < player.escapeChance;
      if (escapeSuccess) {
        logs.push(chalk.green(`#${turn} 성공적으로 도망쳤습니다!`));
        return; // 전투 즉시 종료
      } else {
        logs.push(chalk.red(`#${turn} 도망에 실패했습니다...`));
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`#${turn} 몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    }
    turn++; // 턴 증가
  }
  if (player.hp <= 0) {    logs.push(chalk.red.bold('\nGAME OVER'));    logs.push(chalk.yellow('당신은 몬스터에게 패배했습니다...'));    return; // 전투 종료  
  }
}
// startGame: 전체 게임 흐름 제어 함수
async function startGame() {
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
      await playMathPuzzle(player);
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