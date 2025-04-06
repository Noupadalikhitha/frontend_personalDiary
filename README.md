# Personal Diary - Frontend

A modern, responsive frontend application for the Personal Diary project built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication (Login/Signup)
- Create, read, update, and delete diary entries
- User profile management
- Dark/Light theme support
- Responsive design for all devices

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Toastify
- Heroicons

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Noupadalikhitha/frontend_personalDiary.git
cd frontend_personalDiary
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Project dependencies
```

## API Integration

The frontend communicates with the backend API at the following endpoints:

- Authentication: `/api/login/`, `/api/signup/`, `/api/logout/`
- User Profile: `/api/profile/`
- Diary Entries: `/api/entries/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 