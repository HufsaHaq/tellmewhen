# Tell Me When - Chat Branch
## Prerequisites (Backend)
Navigate to the server folder and run the follwing:
```cmd
npm install
```

## Prerequisites (Frontend)
Navigate to the tellmewhen folder and run:
```cmd
npm install next
```

## Running the Server

**.env needs to be inside of the "server" folder** <br/> <br/>
Firstly, set up the environment variables. The variables should be:
```cmd
PORT_CHAT = ...                     // Port the server will run on
STREAM_API_KEY = ...                // Public API Key from the Stream Chat dashboard
STREAM_SECRET_API_KEY = ...         // Private API Key from the Stream Chat dashboard
STREAM_ADMIN_ID = ...               // ID of the admin account (will most likely be your Stream username)
```

Then, navigate to the server folder and run:
```cmd
npm run dev
```

## Running the Frontend
Navigate to the tellmewhen folder and run:

```cmd
npm run dev
```

## Navigation
All the functionality is added on the debug page with controls to interact with the backend.