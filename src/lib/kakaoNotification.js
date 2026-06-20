// ============================================
// Kakao 로그인 + 알림 통합
// ============================================

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

// 1. Kakao SDK 초기화
export const initKakao = () => {
  if (!window.Kakao) {
    console.error('[Kakao] SDK not loaded');
    return false;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }
  return true;
};

// 2. Kakao 로그인
export const loginWithKakao = () => {
  return new Promise((resolve, reject) => {
    window.Kakao.Auth.authorize({
      redirectUri: window.location.href,
      scope: 'profile_nickname,account_email',
    });

    setTimeout(() => {
      if (window.Kakao.Auth.getAccessToken()) {
        resolve(window.Kakao.Auth.getAccessToken());
      } else {
        reject(new Error('Kakao login failed'));
      }
    }, 1000);
  });
};

// 3. Kakao 사용자 정보
export const getKakaoUser = () => {
  return new Promise((resolve, reject) => {
    window.Kakao.User.me((response) => {
      resolve(response);
    });
  });
};

// 4. Kakao 로그아웃
export const logoutKakao = () => {
  return new Promise((resolve) => {
    window.Kakao.Auth.logout(() => {
      resolve();
    });
  });
};

// 5. 토큰 확인
export const hasKakaoToken = () => {
  return !!window.Kakao?.Auth?.getAccessToken();
};

// 6. 토큰 조회
export const getKakaoToken = () => {
  return window.Kakao?.Auth?.getAccessToken() || null;
};
