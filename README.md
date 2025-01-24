# 1. Instructions

- Set up your Arduino with the corresponding firmware to send over the EMG sensor data through an analogic or digital pin to a serial port (eg. USB; PS: the baud rate must be 115200)

- Make sure you have NodeJS installed
  
- Install dependencies in this directory: `npm install`

- On the file src/index.ts, set up the name of your serial port accordingly:
```typescript
  const serialPort = new SerialPort({
    path: "/dev/cu.usbserial-10",
    baudRate: 115200,
  });
```

- Start the server: `npm start`

- Clone the repository https://github.com/Vicnovais/digital-speller and also install its dependencies with `npm install`

- Start the client: `npm start`

- With both the server and client running, you should see the EMG chart with your sensor data
