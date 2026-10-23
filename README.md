# React Group Chat Application

## Project Overview

The React Group Chat Application is a web-based application that allows users to log in, create chat rooms, switch between rooms, and exchange messages through a simple and responsive interface.

The application uses React for the user interface and browser localStorage to save chat rooms and messages.

## Features

- **Login Page:** Demo authentication with username and password validation.
- **Protected Chat Page:** Redirects users to the login page when they are not logged in.
- **Chat Rooms:** Create new rooms and switch between existing rooms.
- **Messaging:** Send messages using the Send button or Enter key.
- **Message Details:** Display the sender's name, avatar initial, and message time.
- **Emoji Picker:** Add emojis to messages.
- **Search Messages:** Search for messages in the selected room.
- **Session Handling:** Keep the demo login session after refreshing the page.
- **Local Storage:** Save rooms and messages in the browser.
- **Online/Offline Indicators:** Display simulated member availability.
- **Responsive Design:** Support desktop and mobile screen sizes.
- **Empty States:** Display helpful messages when a room has no messages or a search has no results.

## Technologies Used

- React.js
- JavaScript
- HTML
- CSS
- React Router DOM
- Vite
- Browser localStorage
- Git and GitHub

## Demo Login Credentials

- **Username:** `priya`
- **Password:** `chat123`

These credentials are for demonstration purposes only. The application currently uses client-side demo authentication and does not use a backend authentication service.

## Installation and Setup

### Prerequisites

Install Node.js and npm before running the application.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/PriyaMathpati/react-group-chat-app.git
   ```

2. Open the project folder:

   ```bash
   cd react-group-chat-app
   ```

3. Switch to the development branch:

   ```bash
   git switch development
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## How to Use the Application

1. Open the application in your browser.
2. Log in using the demo credentials.
3. Select a chat room from the sidebar.
4. Enter a message and press Enter or click Send.
5. Use the emoji picker to insert emojis.
6. Search for messages using the search field.
7. Create a new room using the plus (+) button.
8. Click Logout to end the demo session.

## Data Storage

The application stores the login session, chat rooms, and messages in browser localStorage. Rooms and messages can remain available after a page refresh in the same browser.

Clearing the browser's localStorage removes the saved application data.

## Limitations

- Authentication is simulated on the client side.
- Messages are not exchanged between different users or devices in real time.
- Online/offline member statuses are examples and are not connected to a live presence service.
- Data is stored locally in the browser rather than in a shared database.

## Repository

GitHub: https://github.com/PriyaMathpati/react-group-chat-app

Development branch: `development`
