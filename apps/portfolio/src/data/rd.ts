import { RDProject } from '../types/portfolio';

export const rdProjects: RDProject[] = [
  {
    id: 'desktop-buddy-ai',
    title: 'Desktop Buddy AI (v2.0)',
    status: 'active',
    description: '[PLACEHOLDER] Refining dual-core task sharing in FreeRTOS to support synchronous mechanical movement and low-latency audio buffering.',
    tags: ['ESP32', 'FreeRTOS', 'Audio DSP']
  },
  {
    id: 'local-llm-optimizations',
    title: 'Local LLM Optimizations on SBCs',
    status: 'active',
    description: '[PLACEHOLDER] Compiling and profiling quantized Llama 3 models on low-power ARM devices to achieve high processing speeds.',
    tags: ['Llama.cpp', 'ONNX', 'Quantization']
  },
  {
    id: 'offline-voice-interfaces',
    title: 'ESP32 Offline Voice Command Interface',
    status: 'experimental',
    description: '[PLACEHOLDER] Developing offline wake-word engines using custom audio spectrogram filters on microcontrollers.',
    tags: ['TensorFlow Lite Micro', 'DSP', 'C++']
  },
  {
    id: 'solar-energy-harvesting',
    title: 'Solar Harvesting Field Telemetry Node',
    status: 'completed',
    description: '[PLACEHOLDER] Successfully built and tested a solar node operating for 90 days with zero grid contact, using under 3mW of average power.',
    tags: ['MPPT', 'Low Power', 'LoRa']
  }
];
