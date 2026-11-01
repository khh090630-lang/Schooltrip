// 알림용 서비스워커 — index.html 과 같은 폴더에 두세요
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// 서버(구글 시트 Apps Script)가 보낸 푸시 → 사이트가 꺼져 있어도 알림 표시
self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (x) { p = { data: { title: '수학여행 알림', body: e.data ? e.data.text() : '' } }; }
  const d = p.data || p.notification || p;
  e.waitUntil(self.registration.showNotification(d.title || '수학여행 알림', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png',
    tag: d.title, renotify: true, vibrate: [300, 150, 300], data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs =>
    cs.length ? cs[0].focus() : clients.openWindow(url)));
});
