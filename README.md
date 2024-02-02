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
                <option value="huhu" data-api=".order.max" data-api-iterate-from="55" />
            </select>
        </p>
    </div>

    <script src="./main.js"></script>
    <script>
        API({
            base: "http://localhost/api/v1.2/",
            calls: [
                {
                    name: "login",
                    url: "login",
                    method: "POST",
                    body: {
                        "email": "User1",
                        "password": "???",
                        "expires": 3
                    },
                    permanent: true,
                    callback: (response) => console.log("LOGIN ready", response)
                },
                { name: "event", url: "event/7170", authenticated: 'login' },
                { name: "tickets", url: "event/7170/articles" }
            ]
        })
    </script>
</body>

</html>
```
