# A Buddy for API access.

Documentation will follow.

This is a usage example:

```
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>API Buddy test</title>
</head>

<body>

    <h1 data-api="event.title">Vor dem Aufruf</h1>
    <div data-api="tickets.*">
        <p>
            Ticket: <span data-api=".title">Vorher</span>
            <select>
                <option value="huhu" data-api=".order.max" data-api-iterate-from="1" />
            </select>
        </p>
    </div>

    <script src="./main.js"></script>
    <script>
        API({
            base: "http://ec2-18-153-92-47.eu-central-1.compute.amazonaws.com/api/v1.2/",
            calls: [
                {
                    name: "login",
                    url: "login",
                    method: "POST",
                    body: {
                        "email": "TeamViewer2021",
                        "password": "???",
                        "expires": 3
                    },
                    permanent: true,
                    callback: onLogin
                },
                { name: "event", url: "gpt/de/event/7050" },
                { name: "tickets", url: "gpt/de/event/7050/articles" }
            ]
        })

        function onLogin(status, response) {
            console.log("LOGIN ready", status, response)
        }
    </script>
</body>

</html>
```
