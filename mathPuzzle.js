// mathPuzzle.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';

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

export async function playMathPuzzle(player, lostHp) {
  console.log(chalk.yellowBright('\n--- 보너스 퍼즐: 연산 마스터 ---'));
  const puzzleData = generateTargetPuzzle();
  const numbers = puzzleData.numbers;
  const operators = puzzleData.operators;
  const targetNumber = puzzleData.targetNumber;

  console.log(chalk.yellow(`주어진 숫자와 연산자를 사용하여 목표 숫자 ${targetNumber}를 만드는 수식을 입력하세요!`));
  console.log(chalk.yellow('수식을 입력하세요. (예: 8 + 2 * 5 - 1)'));

  console.log(chalk.cyan(`\n숫자 카드: [${numbers.join(', ')}]`));
  console.log(chalk.cyan(`연산 카드: [${operators.join(', ')}]`));

  let puzzleResult = null;
  let inputValid = false;

  while (!inputValid) {
    const input = readlineSync.question('수식 입력: ');

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
  } else if (Math.abs(puzzleResult - targetNumber) <= Math.min(...numbers)) {
    console.log(chalk.yellow.bold('아쉽지만 근접했습니다! 부분 보너스를 얻습니다.'));
    v = 0.5; // 50% 보너스
  } else {
    console.log(chalk.red.bold('정답과 너무 멀리 떨어져 있습니다. 보너스 없음.'));
  }

  console.log(chalk.magenta(`계산된 보너스 계수 (v): ${v.toFixed(2)}`));

  if (v > 0) {
    console.log(chalk.yellow('\n어떤 능력치에 보너스를 적용하시겠습니까?'));
    console.log(chalk.blue('1. 체력 회복 (잃은 체력의 1.5배)'));
    console.log(chalk.blue('2. 공격력 증가'));
    console.log(chalk.blue('3. 연속 공격 확률 증가'));
    console.log(chalk.blue('4. 방어 확률 증가'));
    console.log(chalk.blue('5. 도망 확률 증가'));

    let choiceValid = false;
    let statChoice = '';
    while (!choiceValid) {
      statChoice = readlineSync.question('선택 (1-5): ');
      if (['1', '2', '3', '4', '5'].includes(statChoice)) {
        choiceValid = true;
      } else {
        console.log(chalk.red('1-5 사이의 숫자를 입력해주세요.'));
      }
    }

    if (statChoice === '1') {
      const recoveryAmount = lostHp * 1.5 * v;
      player.hp += recoveryAmount;
      console.log(chalk.green(`체력을 ${recoveryAmount.toFixed(1)}만큼 회복했습니다! 현재 HP: ${player.hp.toFixed(1)}`));
    } else if (statChoice === '2') {
      player.minAtk = player.minAtk * (1 + v);
      player.maxAtk = player.maxAtk * (1 + v);
      console.log(chalk.green(`공격력이 ${player.minAtk.toFixed(1)}~${player.maxAtk.toFixed(1)}로 증가했습니다!`));
    } else if (statChoice === '3') {
      player.multiAttackChance = Math.min(player.multiAttackChance + (10 * v), 100);
      console.log(chalk.green(`연속 공격 확률이 ${player.multiAttackChance.toFixed(1)}%로 증가했습니다!`));
    } else if (statChoice === '4') {
      player.defenseChance = Math.min(player.defenseChance + (10 * v), 100);
      console.log(chalk.green(`방어 확률이 ${player.defenseChance.toFixed(1)}%로 증가했습니다!`));
    } else if (statChoice === '5') {
      player.escapeChance = Math.min(player.escapeChance + (10 * v), 100);
      console.log(chalk.green(`도망 확률이 ${player.escapeChance.toFixed(1)}%로 증가했습니다!`));
    }
  } else {
    console.log(chalk.red('보너스를 얻지 못했습니다.'));
  }
  readlineSync.question('보너스 적용 완료! 다음으로 진행하려면 엔터를 누르세요...');
}