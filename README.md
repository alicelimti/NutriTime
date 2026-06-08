# NutriTime 💊

> 영양제 복용 도우미 앱 — 당신의 건강한 하루를 위한 스마트 영양제 관리 솔루션

**배포 주소:** https://alicelimti.github.io/NutriTime/

## 기술 스택

- **Frontend:** React 19 + Vite 8
- **Backend:** Firebase (Firestore + Auth) — 연동 준비 완료
- **배포:** GitHub Pages

## 주요 기능

| 기능 | 설명 |
|------|------|
| 영양제 라이브러리 | 15종 영양제 카드, 검색, 상세 정보 모달 |
| 복용 일정 관리 | 기상직후~취침직전 5단계 시간대 그룹 |
| 오늘의 체크 | 복용 완료 체크 및 진행률 표시 |
| 개인 설정 | 기상·식사·취침 시간 커스터마이징 |

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

## Firebase 설정

`.env.local` 파일에 Firebase 프로젝트 값을 입력하세요:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 개발 로드맵

- **Phase 1 (완료):** 영양제 라이브러리 · 복용 일정 · 기본 UI
- **Phase 2:** Firebase 인증 · 카카오톡 알림 연동
- **Phase 3:** 제휴 광고 · 통계 대시보드

---

*기획안 v1.0 · 2024*
