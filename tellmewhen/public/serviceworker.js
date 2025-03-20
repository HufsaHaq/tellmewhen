/* In the Service Worker. */

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  // Display notification or handle data
  // Example: show a notification
  const data = JSON.parse(event.data.text())
  const title = data.title;
  const body = data.body;
  const icon = '/images/icon.png';
  const tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag
    })
  );

  // Attempt to resubscribe after receiving a notification
  event.waitUntil(resubscribeToPush(data.jobId, data.businessId));
});

function resubscribeToPush(jobId, businessId) {
  return self.registration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .then(function() {
      return self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BNErQOX0hbGYSQNR-wAtxuQmBu9ONQCB1jcCEkZo_wIFtHDuvp9478VhcMbOgBIBbFpFDqV6YHo5QNgsCGLaofg'
      });
    })
    .then(async function(subscription) {
      console.log('Resubscribed to push notifications:', subscription);
      let sub = JSON.parse(JSON.stringify(subscription));

      let json = {
          jobId: jobId,
          endpoint: sub.endpoint,
          businessId: businessId,
          keys: sub.keys,
      }
      alert("yay")
      // Optionally, send new subscription details to your server
      await fetch("http://localhost:4000/save-new-subscription", {
        method: "POST",
        body: json
      }).then(window.location.reload())
    })
    .catch(function(error) {
      console.error('Failed to resubscribe:', error);
    });
}
