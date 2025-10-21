# GuardBox - Secure Email Application

A modern, responsive secure email web application built with React that provides Gmail-like interface with encryption capabilities.

## Features

### 📧 Core Email Features
- **Email List View**: Browse emails with unread indicators, stars, and timestamps
- **Email Reading**: Full email view with sender details, subject, and body
- **Compose Email**: Rich compose interface with To, Cc, Bcc fields
- **Reply Functionality**: Quick reply to emails with pre-filled content
- **Email Actions**: Star, delete, archive, and mark as read/unread
- **Search**: Real-time search across email content, subjects, and senders

### 🔒 Security Features
- **Message Encryption**: Encrypt emails for secure communication
- **Visual Encryption Indicators**: Clear indicators when messages are encrypted
- **Secure Compose**: Encryption toggle in compose toolbar
- **Encrypted Send**: Special send button for encrypted messages

### 🎨 Modern UI/UX
- **Gmail-like Interface**: Clean, familiar design inspired by Gmail
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Modern color scheme with proper contrast
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive interactions
- **Mobile-First**: Optimized mobile experience with collapsible sidebar

### 📱 Mobile Features
- **Responsive Sidebar**: Collapsible navigation for mobile devices
- **Touch-Friendly**: Optimized for touch interactions
- **Mobile Header**: Quick access to compose and navigation
- **Gesture Support**: Swipe and tap interactions

### 🔧 Technical Features
- **React Hooks**: Modern React with functional components and hooks
- **Context API**: Centralized state management for emails
- **Styled Components**: CSS-in-JS for component styling
- **React Router**: Client-side routing for navigation
- **Mock Data**: Realistic email data for demonstration
- **Date Formatting**: Proper timestamp display with date-fns

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ui-crypto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.js      # Navigation sidebar
│   ├── EmailList.js    # Email list view
│   ├── EmailView.js    # Individual email view
│   └── Compose.js      # Compose email modal
├── context/            # React context for state management
│   └── EmailContext.js # Email state and actions
├── App.js             # Main application component
├── index.js           # Application entry point
└── index.css          # Global styles
```

## Key Components

### Sidebar
- Navigation between different email folders (Inbox, Starred, Important, Sent, Trash)
- Search functionality
- Compose button
- Unread email counts

### EmailList
- Displays list of emails with sender, subject, preview, and timestamp
- Email selection and bulk actions
- Star/unstar functionality
- Delete and archive actions

### EmailView
- Full email display with sender details
- Reply, forward, and other email actions
- Proper email formatting and timestamps

### Compose
- Modal compose interface
- To, Cc, Bcc recipient fields
- Subject and body input
- Send functionality with keyboard shortcuts (Ctrl/Cmd + Enter)

## State Management

The application uses React Context API for state management:

- **Email State**: List of emails with read/unread status, stars, etc.
- **Folder Navigation**: Current folder selection (inbox, starred, etc.)
- **Search**: Search query and filtered results
- **Email Actions**: Mark as read, star, delete, compose

## Responsive Design

The application is fully responsive with breakpoints:

- **Desktop**: Full sidebar and email list view
- **Tablet**: Collapsible sidebar with touch-friendly interface
- **Mobile**: Hidden sidebar with mobile header and navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Email attachments support
- [ ] Rich text editor for compose
- [ ] Email templates
- [ ] Advanced search filters
- [ ] Email threading
- [ ] Offline support
- [ ] Push notifications
- [ ] Email encryption
- [ ] Multiple account support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Gmail's interface and functionality
- Built with React and modern web technologies
- Icons provided by Lucide React
- Date formatting with date-fns library
