import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  initKakao,
  loginWithKakao,
  logoutKakao,
  getKakaoUser,
  hasKakaoToken,
} from '../lib/kakaoNotification';
import { useAuth } from '../context/AuthContext';

export default function KakaoLoginButton() {
  const { user } = useAuth();
  const [kakaoConnected, setKakaoConnected] = useState(false);
  const [kakaoUser, setKakaoUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 초기화
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      if (initKakao()) {
        checkKakaoStatus();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Kakao 연결 상태 확인
  const checkKakaoStatus = async () => {
    try {
      if (hasKakaoToken()) {
        const userInfo = await getKakaoUser();
        setKakaoUser(userInfo);
        setKakaoConnected(true);

        // Supabase에 토큰 저장
        await saveKakaoToken();
      } else {
        setKakaoConnected(false);
      }
    } catch (error) {
      console.log('[Kakao] Check status error:', error.message);
    }
  };

  // Kakao 토큰 저장
  const saveKakaoToken = async () => {
    try {
      const { error } = await supabase
        .from('kakao_tokens')
        .upsert([
          {
            user_id: user.id,
            access_token: window.Kakao.Auth.getAccessToken(),
            refresh_token: 'kakao-no-refresh',
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ]);

      if (error) console.error('[Kakao] Save token error:', error);
    } catch (error) {
      console.error('[Kakao] Save error:', error);
    }
  };

  // Kakao 로그인
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithKakao();
      const userInfo = await getKakaoUser();
      setKakaoUser(userInfo);
      setKakaoConnected(true);
      await saveKakaoToken();
      alert('✅ Kakao 로그인 성공!');
    } catch (error) {
      console.error('[Kakao] Login error:', error);
      alert(`❌ 로그인 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Kakao 로그아웃
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutKakao();
      setKakaoConnected(false);
      setKakaoUser(null);

      await supabase
        .from('kakao_tokens')
        .delete()
        .eq('user_id', user.id);

      alert('✅ Kakao 로그아웃됨');
    } catch (error) {
      console.error('[Kakao] Logout error:', error);
      alert(`❌ 로그아웃 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // UI 렌더링
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">🍯 Kakao 계정</h3>
          <p className="text-sm text-gray-600 mt-1">
            {kakaoConnected
              ? `✅ 연결됨 (${kakaoUser?.kakao_account?.email || 'User'})`
              : '⏸️ 미연결'}
          </p>
        </div>

        {kakaoConnected ? (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {isLoading ? '처리 중...' : '로그아웃'}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {isLoading ? '로그인 중...' : 'Kakao 로그인'}
          </button>
        )}
      </div>
    </div>
  );
}
