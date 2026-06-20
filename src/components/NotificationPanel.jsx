import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getKakaoToken, hasKakaoToken } from '../lib/kakaoNotification';
import { useAuth } from '../context/AuthContext';

export default function NotificationPanel() {
  const { user } = useAuth();
  const [kakaoConnected, setKakaoConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('테스트 알림입니다!');

  // 초기화
  useEffect(() => {
    if (!user) return;
    checkKakaoStatus();
  }, [user]);

  // Kakao 연결 확인
  const checkKakaoStatus = () => {
    setKakaoConnected(hasKakaoToken());
  };

  // 테스트 알림 발송
  const handleSendTestNotification = async () => {
    if (!kakaoConnected) {
      alert('먼저 Kakao에 로그인해주세요');
      return;
    }

    setIsLoading(true);
    try {
      // Supabase Edge Function 호출
      const response = await supabase.functions.invoke('send-kakao-notification', {
        body: {
          userId: user.id,
          title: '🍯 NutriTime 알림',
          body: testMessage,
          link: window.location.href,
        },
      });

      if (response.error) throw response.error;

      alert('✅ 알림 발송 완료!');
      setTestMessage('테스트 알림입니다!');
    } catch (error) {
      console.error('[Notification] Send error:', error);
      alert(`❌ 발송 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!kakaoConnected) {
    return (
      <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
        <p className="text-gray-600">
          💡 알림을 사용하려면 먼저 <strong>Kakao 로그인</strong>을 해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg mt-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg">📲 Kakao Talk 알림</h3>
        <p className="text-sm text-gray-600 mt-1">
          ✅ Kakao 연결됨 - 테스트 메시지를 보낼 수 있습니다
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-2">메시지</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="알림 메시지 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          onClick={handleSendTestNotification}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {isLoading ? '발송 중...' : '테스트 알림 발송'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
        💡 <strong>Kakao Talk</strong>으로 알림을 받을 수 있습니다.
        (Android, iOS 모두 동일 ✨)
      </div>
    </div>
  );
}
