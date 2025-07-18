
# 🧾 Rogue-like CLI Game – Git 커밋 계획서

이 문서는 로그라이크 CLI 게임 구현을 위한 기능별 Git 커밋 계획을 정리한 것입니다.  
기초 기능부터 도전 기능까지 순차적으로 구현하며, 각 기능은 독립적 커밋으로 관리됩니다.

---

## ✅ 기본 기능 커밋 순서

### 0. 프로젝트 초기화
```
git commit -m "Initialize project with server/game skeleton and CLI welcome screen"
```

---

### 1. 플레이어와 몬스터 클래스 정의
```
git commit -m "Add Player and Monster classes with base stats (HP, attack)"
```

---

### 2. 기본 행동 메뉴 구현 (공격 & 도망)
```
git commit -m "Implement basic battle menu: attack and escape"
```

---

### 3. 플레이어 공격 → 몬스터 HP 감소
```
git commit -m "Implement player attack logic and monster HP reduction"
```

---

### 4. 몬스터 자동 반격 처리
```
git commit -m "Add monster auto-attack turn after player action"
```

---

### 5. 스테이지 클리어 처리 및 HP 회복
```
git commit -m "Implement stage clear: player HP recovery and stage advancement"
```

---

### 6. 스테이지별 몬스터 능력치 증가
```
git commit -m "Scale monster HP and attack by stage number"
```

---

## 🚀 도전 기능 커밋 순서

### 7. 확률 기반 연속 공격 및 방어 기능 추가
```
git commit -m "Add multi-attack (25%) and defend (50%) options to battle menu"
```

---

### 8. 스테이지 클리어 시 능력치 랜덤 증가
```
git commit -m "Randomly enhance player stats on stage clear (ATK, DEF, crit etc)"
```

---

### 9. 플레이어 확률 스탯이 행동에 반영되도록 구현
```
git commit -m "Apply player's upgraded probabilities to escape, multi-hit, defend"
```

---

### 10. 플레이어 사망 시 게임 종료 및 메시지 출력
```
git commit -m "Add player death handling and game over UI message"
```

---

### 11. 10스테이지 클리어 시 엔딩 구현
```
git commit -m "Implement ending screen on stage 10 clear with final stats"
```

---

## 🧠 선택 구현 (보너스)

### 랜덤 이벤트 시스템 추가
```
git commit -m "Add random event system between stages (e.g. merchant)"
```

### 상태이상 기능 (중독, 기절 등)
```
git commit -m "Implement poison and stun status effects"
```

---

## 💡 커밋 네이밍 팁

| 유형 | Prefix 예시 | 설명 |
|------|-------------|------|
| 기능 추가 | `[Feat]` | 새로운 기능 구현 |
| 버그 수정 | `[Fix]` | 예상치 못한 동작 수정 |
| 구조 변경 | `[Refactor]` | 로직이나 클래스 구조 변경 |
| 문서/주석 | `[Docs]` | README, 주석 등 |
| 코드 스타일 | `[Style]` | 세미콜론, 들여쓰기 등 |

예시:
```
git commit -m "[Feat] Implement monster auto-attack after player turn"
```

---

모든 기능은 기능 단위로 커밋하고, 커밋 메시지는 명확하고 구체적으로 작성하세요.
