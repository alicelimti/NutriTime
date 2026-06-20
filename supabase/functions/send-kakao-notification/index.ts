import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { userId, title, body, link } = await req.json()

    if (!userId || !body) {
      return new Response(
        JSON.stringify({ error: 'userId and body are required' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    // Supabase Admin 클라이언트 (Service Role Key 사용)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. kakao_tokens 테이블에서 access_token 조회
    const { data: tokenRow, error: tokenError } = await supabase
      .from('kakao_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenRow) {
      return new Response(
        JSON.stringify({ error: 'Kakao token not found', detail: tokenError?.message }),
        { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Kakao API로 나에게 메시지 발송
    const kakaoPayload = {
      template_object: JSON.stringify({
        object_type: 'text',
        text: `${title}\n\n${body}`,
        link: {
          web_url: link || 'https://alicelimti.github.io/NutriTime/',
          mobile_web_url: link || 'https://alicelimti.github.io/NutriTime/',
        },
        button_title: '앱 열기',
      }),
    }

    const kakaoRes = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRow.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(kakaoPayload).toString(),
    })

    const kakaoData = await kakaoRes.json()
    const success = kakaoRes.ok && kakaoData.result_code === 0

    // 3. notification_logs 테이블에 발송 이력 기록
    await supabase.from('notification_logs').insert({
      user_id: userId,
      title: title ?? null,
      body,
      link: link ?? null,
      channel: 'kakao',
      success,
      response_code: kakaoData.result_code ?? null,
      error_message: success ? null : (kakaoData.msg ?? kakaoRes.statusText),
    })

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Kakao send failed', detail: kakaoData }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ ok: true, result_code: kakaoData.result_code }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }
})
