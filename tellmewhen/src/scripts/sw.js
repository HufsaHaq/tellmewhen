// Helper function to convert VAPID key to Uint8Array
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
async function saveSubscription(subscription) {
    let endpoint = localStorage["endpoint"];
    const response = await fetch(endpoint + '/save-new-subscription',{
        method:"POST",
        headers:{ 'Content-type': 'application/json'},
        body: JSON.stringify(subscription)
    })
}

//subscribe to push service
self.addEventListener("activate", async ()=>{

    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array('BO9BkKD8IykLzyJ6djlVMziBKTtwIjhhVk_S-W_0gzfP2dC26ytBsDMSdngvT9rCd_0oX8jUGW_e54b_xEXr4LQ')
    }).catch(err =>{
        if(err){
            console.log('Failed to subscribe',err)
            return;
        }
    });
    console.log(subscription);
    saveSubscription(subscription);
})


// Push event listener
self.addEventListener('push', event => {
    console.log('Push event received:', event);

    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Notification Title';
    const options = {
        body: data.body || 'Default Body',
        icon: data.icon || '/images/default-icon.png',
        badge: data.badge || '/images/default-badge.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click listener
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event.notification);

    const notificationData = event.notification.data;
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url === notificationData.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(notificationData.url);
            }
        })
    );
});

// Notification close listener
self.addEventListener('notificationclose', event => {
    console.log('Notification closed:', event.notification);
});

