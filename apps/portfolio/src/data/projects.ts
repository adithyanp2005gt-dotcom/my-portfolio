import { Project } from '../types/portfolio';

export const projects: Project[] = [
  {
    id: 'desktop-buddy',
    slug: 'desktop-buddy',
    title: 'Desktop Buddy AI',
    tagline: 'Local AI Assistant with Embedded Physical Feedback',
    description: 'A physical companion device powered by a local LLM, combining natural language interaction with custom ESP32-driven motor control and status displays.',
    tags: ['ESP32', 'Python', 'Local LLM', 'Llama.cpp', 'C++', 'FreeRTOS', 'SPI', 'UART'],
    githubUrl: 'https://github.com/adithyanp2005gt-dotcom/desktop-buddy-ai',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3EDESKTOP BUDDY AI%3C/text%3E%3C/svg%3E',
    overview: 'This project explores the boundary between digital AI models and physical interfaces. By hosting a quantized Llama 3 model locally on a PC, a custom ESP32 board acts as the tactile interface, displaying AI emotional states via an OLED display and mechanical micro-servo movements.',
    problem: 'Standard AI interfaces are locked behind screen pixels and web API latency, resulting in flat, non-tactile user experiences that lack direct environmental presence or hardware-level responsiveness.',
    goals: [
      'Implement localized natural language processing with sub-200ms audio response latency.',
      'Establish a robust UART serial command protocol between the local PC host and ESP32 hardware.',
      'Design dynamic OLED UI rendering and servo movement algorithms representing speech pace and emotion states.'
    ],
    research: 'Researched local LLM inference engines (Llama.cpp vs. Ollama) and lightweight RTOS task synchronization methods for ESP32. Evaluated communication protocols to ensure low jitter and real-time responsiveness under constrained hardware bandwidth.',
    architecture: {
      description: 'A Python orchestrator executes local voice activity detection (VAD), calls the local Llama inference wrapper, and maps output sentiments to specific hardware control bytes. The ESP32 parses these bytes concurrently to update displays and actuate servo motors.',
    },
    hardware: [
      'ESP32-WROOM-32E MCU board',
      'SSD1306 128x64 I2C OLED Display',
      'SG90 Micro Servo Motors (2x for physical nodding/tilting)',
      'Custom PCB with built-in power regulation and level shifting'
    ],
    software: [
      'FreeRTOS (dual-core task scheduling)',
      'Llama.cpp (GGUF localized inference)',
      'PyAudio & Whisper (for Real-time Speech-to-Text)',
      'Custom C++ Hardware Drivers (I2C, PWM)'
    ],
    process: 'The system was developed incrementally: first, stabilizing local LLM streaming outputs; second, constructing the ESP32 parser tasks; and third, prototyping the physical housing. Precise tuning of the PWM motor timings was required to avoid servo jitter.',
    challenges: 'Synchronizing the audio-out stream with physical mechanical movement while avoiding CPU bottlenecks. The audio stream and model execution would occasionally block serial writes, introducing stutter to the servos.',
    solutions: 'Offloaded audio playback to a dedicated worker thread in Python and refactored the ESP32 firmware to process servo motor movements using a non-blocking queue model running on Core 0, leaving Core 1 entirely free for display updates.',
    results: 'Completed prototype executes 4-bit quantized inference under 1.2 seconds, streams audio seamlessly, and triggers physically synced visual responses with an overall latency envelope below 400ms.',
    keyTakeaways: [
      'Local execution of LLMs is highly practical for single-user applications when memory bandwidth is structured carefully.',
      'Asynchronous task decoupling in FreeRTOS is critical when coordinating blocking IO operations like I2C screen writing and PWM motor control.',
      'Hardware-in-the-loop testing early in the cycle avoids integration issues with physical tolerances.'
    ],
    lessonsLearned: 'Mechanical feedback systems introduce latency that must be compensated in software. Adding a simple predictive smoothing filter to the servo trajectory commands made transitions feel organic rather than robotic.',
    futureWork: 'Plan to transition the local Python orchestrator to run directly on an embedded SBC (like a Raspberry Pi 5) and transition the connection to standard Bluetooth LE for standalone mobility.'
  },
  {
    id: 'smart-irrigation',
    slug: 'smart-irrigation',
    title: 'Smart Irrigation System',
    tagline: 'Edge AI Agriculture Monitoring Platform',
    description: 'An automated agricultural system using LoRa meshes, solar-harvesting ESP32 nodes, and localized AI moisture prediction algorithms.',
    tags: ['ESP32', 'LoRa', 'Edge AI', 'TensorFlow Lite', 'Solar Harvesting', 'SPI', 'Low Power'],
    githubUrl: 'https://github.com/adithyanp2005gt-dotcom/smart-irrigation-mesh',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3ESMART IRRIGATION%3C/text%3E%3C/svg%3E',
    overview: 'Developed as a local testing platform for long-range, self-powered agricultural monitoring. The network comprises solar-harvesting node boxes containing soil moisture sensors, temperature probes, and a LoRa transceiver, communicating back to a central hub.',
    problem: 'Standard irrigation systems rely on simplistic timers or centralized cloud sensors that suffer from massive connectivity drops, high power requirements, and lack localized prediction intelligence.',
    goals: [
      'Develop nodes operating strictly on solar-harvested battery power (under 5mA average draw).',
      'Establish a low-power LoRa mesh topology communicating reliably up to 2km in dense vegetation.',
      'Deploy an on-node TensorFlow Lite model to predict soil moisture saturation trends 6 hours in advance.'
    ],
    research: 'Analyzed solar MPPT charging architectures and LoRa packet collision rates. Investigated TensorFlow Lite for Microcontrollers (TFLite Micro) memory constraints on ESP32 chips.',
    architecture: {
      description: 'Solar nodes read analog sensor arrays, execute a lightweight neural net to assess local evaporation rates, package the predictions, and broadcast over a custom multi-hop mesh. The gateway parses these packets to trigger localized solenoid valves.',
    },
    hardware: [
      'ESP32-S3 custom ultra-low-power development board',
      'Ra-02 LoRa SX1278 Modules (433MHz mesh)',
      '18650 Li-ion batteries with custom TP4056 MPPT charger',
      'Capacitive soil moisture sensors & DS18B2B temperature probes'
    ],
    software: [
      'Arduino IDE / ESP-IDF build pipeline',
      'TensorFlow Lite for Microcontrollers (TFLite Micro)',
      'RadioLib LoRa mesh implementation library',
      'Deep Sleep Power Management APIs'
    ],
    process: 'Verified solar harvesting efficiency in variable cloud conditions. Benchmarked deep sleep states using a digital multimeter, and optimized the TF model using 8-bit integer quantization to reduce RAM overhead.',
    challenges: 'ESP32 deep sleep wake-up routines would occasionally drop the LoRa mesh sync, leading to lost packets. In addition, the predictive TF model was initially too large for standard ESP32 RAM.',
    solutions: 'Implemented state preservation in RTC memory to bypass mesh re-handshaking during deep sleep wakeups. Quantized the neural network model, reducing the footprint by 78% (down to 12KB) and allowing it to run within the internal cache.',
    results: 'The system achieved a continuous 98.4% packet delivery rate over a 1.8km radius, with nodes successfully operating indefinitely on solar power under typical daylight profiles.',
    keyTakeaways: [
      'LoRa is incredibly robust for telemetry when state tracking is maintained in localized static RAM.',
      'Sub-milliamp sleep cycles are only achievable if peripheral voltage rails are isolated using physical P-channel MOSFET switches.'
    ],
    lessonsLearned: 'Soil chemistry alters capacitive moisture readings over time. A self-calibration routine was built directly into the node firmware to adjust baseline inputs dynamically.',
    futureWork: 'Integrating low-cost satellite backhauls to enable direct deployment in remote regions lacking cellular infrastructure.'
  },
  {
    id: 'smart-parking',
    slug: 'smart-parking',
    title: 'Computer Vision Smart Parking',
    tagline: 'Edge AI Occupancy Analysis Platform',
    description: 'An AI-powered parking surveillance system performing real-time space occupancy analysis on edge hardware without cloud dependency.',
    tags: ['Python', 'OpenCV', 'YOLO', 'PyTorch', 'Edge Computing', 'FastAPI', 'Docker', 'SQLite'],
    githubUrl: 'https://github.com/adithyanp2005gt-dotcom/edge-cv-parking',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3ESMART PARKING%3C/text%3E%3C/svg%3E',
    overview: 'Designed to monitor parking lots locally. An edge processor reads high-resolution IP camera streams, runs a custom-trained object detection pipeline to check vacancy coordinates, and serves parking data locally.',
    problem: 'Standard automated parking solutions require expensive in-ground magnetic sensors or upload heavy video feeds to the cloud, consuming massive internet bandwidth and raising privacy concerns.',
    goals: [
      'Run vehicle detection locally at over 15 FPS on a low-power single board computer.',
      'Maintain occupancy detection accuracy above 96% under heavy shadows, rain, and night conditions.',
      'Design a web API to expose live parking data with ultra-low latency response cycles.'
    ],
    research: 'Researched object detection architectures (YOLOv8-nano vs. MobileNet-SSD) for CPU performance. Evaluated perspective projection mapping to handle camera angle distortions.',
    architecture: {
      description: 'A system daemon grabs RTSP frame feeds, processes them using OpenCV image warps, sends localized segments to a PyTorch/ONNX model, and saves updates to an internal SQLite database exposed via FastAPI.',
    },
    hardware: [
      'Raspberry Pi 4 (8GB RAM) / Local x86 Edge gateway',
      'IP Surveillance Camera (1080p RTSP Stream)',
      'PoE Network Switch'
    ],
    software: [
      'OpenCV (Image transformation & warping)',
      'YOLOv8-nano (Object detection quantized to ONNX)',
      'FastAPI (REST API layer)',
      'Docker & Docker Compose (Containerized edge orchestration)'
    ],
    process: 'The system was built by first creating a configuration script to let users draw and save parking slot coordinates, followed by compiling custom OpenCV filters to eliminate headlight glare, and ending with Docker packaging.',
    challenges: 'Night-time detection was highly inaccurate due to lens flare and low light. In addition, processing the full frame at high frame rates throttled the Raspberry Pi CPU.',
    solutions: 'Transformed the algorithm to execute inference only on cropped bounding box coordinates of pre-defined spaces rather than scanning the entire image. Developed a custom low-light contrast adjustment script to boost dark pixels prior to evaluation.',
    results: 'The localized model runs at 18 FPS on standard edge hardware, maintaining an average accuracy rating of 97.2% across a full 30-day testing cycle in varying weather formats.',
    keyTakeaways: [
      'Edge AI is fully viable without specialized accelerators if visual context is filtered and cropped beforehand.',
      'ONNX runtime optimizations yield massive speed improvements compared to running raw PyTorch weights on CPUs.'
    ],
    lessonsLearned: 'Camera drift due to wind causes coordinate offsets. Added an automatic visual calibration anchor that offsets coordinates dynamically if a designated landmark shifts.',
    futureWork: 'Add optical flow algorithms to detect vehicle entry and exit trajectories to predict wait times.'
  },
  {
    id: 'wifi-deauth',
    slug: 'wifi-deauth',
    title: 'ESP8266 WiFi Deauthenticator',
    tagline: 'Network Security Testing Device',
    description: 'A pocket-sized penetration testing tool built on the ESP8266 to test Wi-Fi network vulnerability to 802.11 deauthentication frames.',
    tags: ['ESP8266', 'C++', 'Security', '802.11', 'Embedded'],
    githubUrl: 'https://github.com/adithyanp2005gt-dotcom/esp8266-deauth',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3EWIFI DEAUTH%3C/text%3E%3C/svg%3E',
    overview: 'Developed a portable ESP8266-based device that scans for 802.11 networks and can inject deauthentication frames to test network resilience and management frame protection.',
    problem: 'Many legacy and even some modern Wi-Fi networks lack 802.11w Management Frame Protection (MFP), making them susceptible to trivial deauthentication attacks.',
    goals: [
      'Build a self-contained device that operates from a small lipo battery.',
      'Provide a local web interface hosted on the ESP8266 for scanning and targeting.',
      'Demonstrate the necessity of 802.11w MFP in enterprise networks.'
    ],
    research: 'Researched the 802.11 protocol, specifically the structure of management frames and how the ESP8266 SDK allows for raw packet injection.',
    architecture: {
      description: 'The ESP8266 runs in AP and Station mode concurrently, hosting a lightweight web server for the UI while utilizing the Promiscuous mode API to sniff and inject raw 802.11 packets.',
    },
    hardware: [
      'ESP8266 NodeMCU or Wemos D1 Mini',
      'TP4056 Lipo Charging Module',
      '3.7V Lipo Battery'
    ],
    software: [
      'Arduino Core for ESP8266',
      'ESP8266 SDK Promiscuous Mode APIs',
      'HTML/CSS/JS for the captive portal Web UI'
    ],
    process: 'Reverse-engineered the ESP8266 packet injection capabilities and implemented a state machine to handle scanning, selecting targets, and transmitting spoofed packets efficiently without crashing the MCU.',
    challenges: 'The ESP8266 SDK has undocumented quirks when switching between promiscuous mode and hosting a web server, often leading to watchdog resets.',
    solutions: 'Carefully scheduled packet injection bursts interspersed with `yield()` calls and web server polling to satisfy the hardware watchdog timer.',
    results: 'Successfully demonstrated that networks without 802.11w can be easily disrupted by a $3 microcontroller, highlighting the critical need for modern security standards.',
    keyTakeaways: [
      'Management Frame Protection is not just a theoretical need.',
      'The ESP8266 is remarkably capable for raw packet manipulation despite its low cost.'
    ],
    lessonsLearned: 'Balancing network stack tasks (like a Web Server) with blocking raw packet injection requires a deep understanding of the underlying RTOS and watchdog mechanisms.',
    futureWork: 'Add an OLED screen and buttons for a completely headless, web-free operation mode.'
  },
  {
    id: 'quadcopter',
    slug: 'quadcopter',
    title: 'Custom Quadcopter Drone',
    tagline: 'APM 2.8 Flight Controller Build',
    description: 'Designed and assembled a custom quadcopter from individual components using the APM 2.8 flight controller, establishing early foundational experience with autonomous flight systems.',
    tags: ['APM 2.8', 'Robotics', 'Embedded Electronics', 'Hardware', 'Mission Planner'],
    githubUrl: '',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3EQUADCOPTER%3C/text%3E%3C/svg%3E',
    overview: 'Built during my 8th-grade studies as a self-driven electronics and robotics project. The drone was assembled from individual components and configured using the APM 2.8 flight controller, providing hands-on experience with flight control systems, sensor calibration, power distribution, and remote-controlled aircraft.',
    problem: 'This was a foundational self-driven educational project designed to understand the complex working principles of flight controllers, onboard sensors, and the mechanics of stable multirotor flight.',
    goals: [
      'Learn the fundamentals of drone technology and flight dynamics.',
      'Understand the working principles of flight controllers and onboard sensors.',
      'Build and configure a stable quadcopter from individual hardware components.',
      'Gain practical experience in electronics assembly and troubleshooting.'
    ],
    research: 'Researched compatible drone components, APM firmware configuration, and RC communication systems. Studied motor direction, propeller configuration, and sensor calibration techniques.',
    architecture: {
      description: 'An X-frame quadcopter powered by a LiPo battery with power distributed to four brushless DC motors via ESCs. The APM 2.8 flight controller processes radio inputs and sensor data to stabilize flight in real-time.',
    },
    hardware: [
      'APM 2.8 Flight Controller',
      'Brushless DC Motors (4) & ESCs',
      'Power Distribution Board',
      'Lithium Polymer (LiPo) Battery',
      'GPS Module',
      'Radio Transmitter and Receiver',
      'Quadcopter Frame (X Configuration)'
    ],
    software: [
      'Mission Planner',
      'APM Firmware'
    ],
    process: 'Selected compatible components and assembled the X-frame. Wired the ESCs, power distribution, and APM flight controller. Installed the APM firmware, followed by rigorous calibration of the accelerometer, compass, radio controller, and ESCs using Mission Planner before conducting ground and flight tests.',
    challenges: 'Encountered issues with motor direction, propeller configuration, and flight controller calibration. Vibration heavily affected sensor accuracy, and ESC synchronization required precise tuning to achieve stable flight.',
    solutions: 'Corrected motor rotation and propeller placement. Performed complete sensor calibration using Mission Planner. Reduced vibrations through proper hardware mounting and balancing. Tuned flight parameters to improve stability and responsiveness.',
    results: 'The project successfully demonstrated stable flight after configuration and calibration. Building the drone provided immense practical experience in robotics, embedded systems, electronics integration, and autonomous flight control, becoming one of my most formative early engineering projects.',
    keyTakeaways: [
      'Gained deep understanding of drone assembly and flight controller configuration.',
      'Learned the critical importance of vibration dampening and precise sensor calibration in autonomous systems.',
      'Developed hands-on skills in soldering, power distribution, and LiPo battery safety.'
    ],
    lessonsLearned: 'Hardware troubleshooting requires patience, especially when mechanical vibrations directly corrupt digital sensor data. Proper isolation of the flight controller is just as critical as the software tuning.',
    futureWork: 'This project laid the groundwork for my ongoing interest in embedded control systems, autonomous robotics, and edge AI.'
  },
  {
    id: 'rc-airplane',
    slug: 'rc-airplane',
    title: 'Custom RC Airplane',
    tagline: 'Scratch-Built Fixed-Wing Aircraft',
    description: 'Designed and built a fully manual radio-controlled (RC) airplane from scratch, focusing on aerodynamics, weight distribution, and mechanical assembly.',
    tags: ['Aeromodelling', 'RC Electronics', 'Aerodynamics', 'Mechanical Fabrication', 'Hardware'],
    githubUrl: '',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Cpath d="M250 225 L550 225 M400 100 L400 350" stroke="%23252525" stroke-width="1"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3ERC AIRPLANE%3C/text%3E%3C/svg%3E',
    overview: 'Built during my 10th-grade studies as a personal aeromodelling project. The aircraft was constructed entirely from scratch and controlled using standard RC electronics, providing foundational, hands-on experience in aircraft design, mechanical assembly, aerodynamics, and servo-based flight control.',
    problem: 'The goal was to deeply understand the relationship between aerodynamics, center of gravity, and flight stability by building a functioning fixed-wing aircraft from the ground up.',
    goals: [
      'Learn the fundamentals of fixed-wing aircraft design.',
      'Build a lightweight and perfectly balanced airframe.',
      'Understand the relationship between aerodynamics and flight stability.',
      'Gain practical experience with RC flight systems and servo mechanisms.'
    ],
    research: 'Studied aerodynamic principles, airfoil design, and center of gravity calculations. Evaluated various lightweight materials for airframe construction and investigated standard RC control surface configurations.',
    architecture: {
      description: 'A custom-built fixed-wing airframe utilizing a LiPo battery and ESC to drive a brushless DC motor. Manual flight control is achieved via a multi-channel radio receiver actuating independent servo motors for the ailerons, elevator, and rudder.',
    },
    hardware: [
      'Custom Built Airframe',
      'Brushless DC Motor & Propeller',
      'Electronic Speed Controller (ESC)',
      'Servo Motors',
      'RC Transmitter and Receiver',
      'LiPo Battery'
    ],
    software: [
      'Manual Radio Control (No Flight Controller Firmware)'
    ],
    process: 'Designed and assembled the lightweight aircraft frame from scratch. Installed the propulsion system and mounted servo motors to actuate the control surfaces. Configured the radio transmitter, balanced the aircraft by meticulously adjusting the center of gravity, and moved to iterative flight testing.',
    challenges: 'Maintaining the correct center of gravity while keeping the structural weight down was a continuous struggle. Servo linkage alignment was delicate, and achieving sufficient lift with a heavy battery required extensive flight trimming.',
    solutions: 'Adjusted battery placement to achieve proper balance without adding dead weight. Fine-tuned the control surface mechanical throws and reinforced key structural areas while removing excess material from non-load-bearing sections.',
    results: 'The project successfully demonstrated the core principles of fixed-wing flight and manual radio control, taking off, maneuvering, and landing under full manual operation.',
    keyTakeaways: [
      'Center of Gravity is the single most critical factor in fixed-wing flight stability.',
      'Mechanical linkages for servos must be robust but absolutely slop-free to maintain precise control.',
      'Structural integrity must always be balanced against weight in aerospace design.'
    ],
    lessonsLearned: 'Iterative engineering is crucial. First flights often end in minor crashes, but understanding why the crash happened (e.g., tail-heavy center of gravity) dictates the success of the next iteration.',
    futureWork: 'Continue exploring aeromodelling and autonomous fixed-wing UAV platforms with integrated autopilot sensors.'
  }
];
