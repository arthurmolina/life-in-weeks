# Life in Weeks

Visualize your life one week at a time. An interactive calendar that shows your entire life as a grid of weeks, helping you appreciate the finite nature of time and make every week count.

![Life in Weeks](public/og-image.png)

## ✨ Features

- **📊 Life Visualization**: See your entire life as a 52-column grid (52 weeks × years)
- **🎨 Week Marking**: Click any week to mark important life events with custom colors and notes
- **🌐 Multi-language**: Full support for English and Portuguese
- **🌗 Dark Mode**: Beautiful light and dark themes
- **🔗 Shareable URLs**: All your data encoded in the URL for easy sharing
- **📱 Social Sharing**: Share to X/Twitter, WhatsApp, Telegram, Facebook with QR code support
- **⚡ Real-time Updates**: See your current age and weeks remaining update live
- **🎯 Life Expectancy**: Uses UN data by country and gender, with custom override
- **💾 No Backend**: Everything runs client-side, your data stays private
- **📊 Interactive Legend**: Clear visual guide to understand the grid

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Use

1. **Enter Your Information**:
   - Fill in your birthdate
   - Select your gender and country
   - Optionally set a custom life expectancy

2. **Visualize Your Life**:
   - See weeks lived (blue)
   - Current week (green with ring)
   - Weeks remaining (gray)

3. **Mark Important Events**:
   - Click any week to add a marking
   - Choose a color, label, and optional note
   - Your marked weeks will appear in custom colors

4. **Share Your Visualization**:
   - Click the "Share" button
   - Copy the link or share directly to social media
   - QR code available for mobile sharing

5. **Toggle Settings**:
   - Switch between light/dark mode
   - Change language (EN ↔ PT)

## 🏗️ Project Structure

```
life-in-weeks/
├── src/
│   ├── components/        # React components
│   │   ├── form/         # Form inputs
│   │   ├── grid/         # Life grid visualization
│   │   ├── layout/       # Header, Footer
│   │   └── modals/       # Modal dialogs
│   ├── contexts/         # React contexts (Theme, AppState)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── i18n/             # Internationalization config
│   └── assets/           # Styles and images
└── public/
    ├── locales/          # Translation files (en, pt)
    └── data/             # Life expectancy data
```

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Flowbite
- **Internationalization**: react-i18next
- **SEO**: react-helmet-async
- **QR Codes**: qrcode.react
- **Date Handling**: date-fns
- **State Management**: React Context API

## 🌍 Internationalization

The app supports:
- 🇺🇸 English
- 🇧🇷 Portuguese

To add a new language:
1. Create `public/locales/[lang]/translation.json`
2. Update `src/i18n/config.js` to include the language
3. Add language option to `LanguageToggle` component

## 📦 Deployment

### GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

The app is configured to deploy to GitHub Pages automatically. Update the `base` in `vite.config.ts` to match your repository name.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Tim Urban's "Your Life in Weeks" concept from Wait But Why
- Life expectancy data from the United Nations
