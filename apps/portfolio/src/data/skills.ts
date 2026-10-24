import { SkillCategory } from '../types/portfolio';

export const skillCategories: SkillCategory[] = [
  {
    name: 'Programming Languages',
    description: 'Writing high-performance logic, hardware firmware, and server applications.',
    skills: ['Python', 'C++', 'C', 'TypeScript', 'JavaScript', 'SQL']
  },
  {
    name: 'Artificial Intelligence',
    description: 'Building computer vision, local LLM, and machine learning systems.',
    skills: ['TensorFlow', 'PyTorch', 'OpenCV', 'YOLO', 'Llama.cpp', 'Whisper', 'ONNX']
  },
  {
    name: 'Embedded Systems',
    description: 'Designing real-time firmware, sensor acquisition, and wireless node communications.',
    skills: ['ESP32', 'STM32', 'FreeRTOS', 'LoRa SX1278', 'I2C', 'SPI', 'UART', 'PWM', 'Arduino']
  },
  {
    name: 'Backend & Developer Tools',
    description: 'Creating reliable APIs, container environments, and managing operating platforms.',
    skills: ['FastAPI', 'REST APIs', 'Docker', 'Git', 'Linux', 'SQLite']
  },
  {
    name: 'Frontend Development',
    description: 'Developing highly interactive web interfaces and product control boards.',
    skills: ['React 19', 'Tailwind CSS v4', 'Vite', 'HTML5', 'CSS3']
  }
];
