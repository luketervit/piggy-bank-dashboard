# Piggy Bank Dashboard

A modern dashboard application for monitoring and controlling a smart piggy bank with educational games. The project consists of a frontend React application and an ESP32-based backend.

## Project Structure

```
piggy-bank-dashboard/
├── frontend/           # React application for the dashboard
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # ESP32 firmware and related files
│   ├── src/          # ESP32 source code
│   │   ├── wifistuff.cpp
│   │   ├── wifistuff.h
│   │   └── ...       # Other ESP32 files
│   └── README.md     # Backend-specific documentation
└── README.md         # This file
```

## Features

- Real-time monitoring of piggy bank contents
- Educational math games with multiple difficulty levels
- Two game modes:
  - Coin Combinations: Given an amount, add up to it using coins
  - Add Them Up: Add coins and submit the total amount
- Performance tracking and analytics
- Remote control of coin dispensing
- WiFi connectivity for remote access

## Prerequisites

- Node.js (v16 or higher)
- Arduino IDE or PlatformIO for ESP32 development
- ESP32 development board
- Required ESP32 libraries:
  - WiFiManager
  - WebServer
  - ESPmDNS
  - ArduinoJson

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The dashboard will be available at `http://localhost:5173`

### Backend Setup (ESP32)

1. Open the backend project in Arduino IDE or PlatformIO
2. Install required libraries through the library manager
3. Configure WiFi settings in `wifistuff.cpp`:
   ```cpp
   const char* ssid = "PiggyBank_AP";
   const char* password = "0inkMoney!";
   ```
4. Upload the firmware to your ESP32

### Connecting Frontend to Backend

1. The ESP32 creates a WiFi access point named "PiggyBank_AP"
2. Connect to this network using the password "0inkMoney!"
3. The dashboard will automatically connect to the piggy bank at `http://piggybank.local`

## API Endpoints

The ESP32 provides the following REST API endpoints:

- `GET /api/bankvalues` - Get current coin counts
- `GET /api/gamehistory` - Get game history
- `POST /api/exactdispense` - Dispense exact amount
- `POST /api/denominationdispense` - Dispense specific denomination
- `DELETE /api/emptybank` - Dispense all coins

## Development

### Frontend Development

The frontend is built with:
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts for data visualization

### Backend Development

The ESP32 firmware handles:
- WiFi connectivity
- Coin counting and dispensing
- Game logic and scoring
- Data storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
