/* In the Service Worker. */
/*
self.addEventListener("push", async function (event) {
	console.log("Received a push message", event);

	// Display notification or handle data
	// Example: show a notification
	const data = JSON.parse(event.data.text());
	const title = data.title;
	const body = data.body;
	const icon = "/images/icon.png";
	const tag = "simple-push-demo-notification-tag";


	await self.registration.showNotification(title, {
		body: body,
		tag: tag,
		vibrate: [200, 100, 200],
	})
});
*/

self.addEventListener("install", () => {
    console.info("service worker installed.");
});

const sendDeliveryReportAction = () => {
    console.log("Web push delivered.");
};

self.addEventListener("push", function (event) {
    if (!event.data) {
        return;
    }

	const data = JSON.parse(event.data.text());
	const title = data.title;
	const body = data.body;


    event.waitUntil(
        self.registration.showNotification(title, {
			body: body,
			vibrate: [200, 100, 200]
		}).then(() => {
            sendDeliveryReportAction();
        })
    );
});

self.addEventListener("notificationclick", function (event) {
    console.log("Notification clicked.");
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            const url = event.notification.data.url;

            if (!url) return;

            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                console.log("Opening window.");
                return clients.openWindow(url);
            }
        })
    );
});
