// server.js
import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame} from "./game.js";

// displayLobby: 게임 로비 화면을 그려주는 함수입니다.
// 1) 콘솔을 깨끗이 지우고
// 2) ASCII 아트 제목, 경계선, 옵션 목록을 출력하여
// 3) 사용자가 1-4 사이의 번호를 입력하도록 안내합니다.
function displayLobby() {
    console.clear();  // 이전 출력물 지우기

    // 타이틀 텍스트 (ASCII 아트)
    console.log(
        chalk.cyan(
            figlet.textSync('RL- Javascript', {
                font: 'Standard',                
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선 생성
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 환영 메시지
    console.log(chalk.yellowBright.bold('CLI 게임에 오신것을 환영합니다!'));

    // 옵션 안내 문구
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 선택 가능한 옵션 나열
    console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('3.') + chalk.white(' 옵션'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선 및 입력 안내
    console.log(line);
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// handleUserInput: 사용자의 입력을 받아 분기 처리합니다.
// 입력 값에 따라 startGame() 호출, 업적/옵션 메뉴, 종료, 혹은 재입력을 처리합니다.
function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            startGame();  // 실제 게임 로직 실행
            break;
        case '2':
            console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
            handleUserInput();  // 다시 선택 받기
            break;
        case '3':
            console.log(chalk.blue('구현 준비중입니다.. 게임을 시작하세요'));
            handleUserInput();  // 다시 선택 받기
            break;
        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0);  // Node.js 프로세스 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput();  // 잘못된 입력 시 재귀 호출로 재입력
    }
}

// start: 프로그램 진입점
// 1) 로비 화면 출력
// 2) 사용자 입력 처리 함수 호출
function start() {
    displayLobby();
    handleUserInput();
}

// 파일이 실행되면 start()가 호출되어 프로그램이 시작됩니다.
start();
