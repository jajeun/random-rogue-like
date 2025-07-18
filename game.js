
// game.js
import chalk from 'chalk';                   // 콘솔 색상 출력을 위한 라이브러리
import readlineSync from 'readline-sync';     // 동기식 키보드 입력 처리

// Player: 플레이어의 상태와 행동을 관리하는 클래스
class Player {
  constructor() {
    this.hp = 100;   // 초기 체력 설정
    // TODO: 추가 스탯 (공격력, 방어력, 도망 확률 등)도 여기에서 정의할 수 있습니다.
  }

  attack() {
    // 플레이어가 공격할 때 호출되는 메서드
    // 예: 몬스터 hp를 감소시키는 로직을 구현합니다.
  }
}

// Monster: 몬스터의 상태와 행동을 관리하는 클래스
class Monster {
  constructor() {
    this.hp = 100;   // 초기 몬스터 체력 설정
    // TODO: 스테이지(stage)에 따라 hp, 공격력 등을 조정하는 로직을 추가할 수 있습니다.
  }

  attack() {
    // 몬스터가 플레이어를 공격할 때 호출되는 메서드
    // 예: 플레이어 hp를 감소시키는 로직을 구현합니다.
  }
}

// displayStatus: 현재 스테이지와 플레이어/몬스터 상태를 화면에 출력합니다.
// - stage: 현재 레벨
// - player: Player 인스턴스
// - monster: Monster 인스턴스
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 정보`) +
    chalk.redBright(`| 몬스터 정보 |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
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
      chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`)
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // TODO: choice 값에 따라
    // 1) 공격: player.attack() 호출 → monster.hp 감소,
    // 2) 아무것도 안함: 턴 스킵
    // 3) 그 외: 잘못된 입력 처리
    // 이후 몬스터의 attack() 호출 로직도 추가해야 합니다.
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
  }
  // 여기서 player.hp <= 0일 때 전투 종료, 패배 로직 필요
};

// startGame: 전체 게임 흐름 제어 함수
export async function startGame() {
  console.clear();
  const player = new Player();  // 플레이어 생성
  let stage = 1;

  // 스테이지 1부터 10까지 반복
  while (stage <= 10) {
    const monster = new Monster(stage);  // 새로운 몬스터 생성
    await battle(stage, player, monster); // 전투 진행

    // TODO: 전투 후
    // - 스테이지 클리어 조건 체크
    // - player.hp 회복 로직
    // - monster 강해지기 로직
    // - 게임 종료(모든 스테이지 클리어 or player.hp <= 0) 처리

    stage++;
  }
  // TODO: 최종 클리어 메시지 또는 패배 메시지 출력
}
