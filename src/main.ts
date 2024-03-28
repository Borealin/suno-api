import fetch from 'node-fetch';

const login = async () => {
  const result = await fetch('https://clerk.suno.ai/v1/client/sign_ins', {
    headers: {
      // accept: '*/*',
      // 'accept-language':
      //   'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ar-XB;q=0.6,ar;q=0.5,ja;q=0.4,zh-TW;q=0.3',
      // 'content-type': 'application/x-www-form-urlencoded',
      // 'sec-ch-ua':
      //   '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      // 'sec-ch-ua-mobile': '?0',
      // 'sec-ch-ua-platform': '"Windows"',
      // 'sec-fetch-dest': 'empty',
      // 'sec-fetch-mode': 'cors',
      // 'sec-fetch-site': 'same-site',
      // cookie:
      //   '__cf_bm=QGW7OTwfAxL3EsqzW7jZx.c.O.9.L3ib94mD7yvvXT4-1711598350-1.0.1.1-b7VIpb65e3qDucYPViWgJHAAMjHL69f3ftrM7wG6J26FwTROm8AE2eDXK5mRZftboaDJEUEBFBUmYP45z9MgmQ; _cfuvid=PmcN8OSi6plS8OwT9_c63b3IFl5NUV2goaNGLlw1h9w-1711598350926-0.0.1.1-604800000; __client_uat=0',
      // Referer: 'https://app.suno.ai/',
      // 'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify({
      strategy: 'oauth_google',
      redirect_url: 'https://accounts.suno.ai/sign-in#/sso-callback',
      action_complete_redirect_url: 'https://app.suno.ai',
    }),
    method: 'POST',
  });
  console.log(result);
};

login();
