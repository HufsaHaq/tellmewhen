/* In the Service Worker. */

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
