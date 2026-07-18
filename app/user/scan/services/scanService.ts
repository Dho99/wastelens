export interface ScanState {
  flashOn: boolean;
  activeCamera: 'front' | 'back';
  isScanning: boolean;
  detectedItems: string[];
}

export const getScanStatusMock = (): ScanState => {
  return {
    flashOn: false,
    activeCamera: 'back',
    isScanning: true,
    detectedItems: ["Plastik", "Organik"]
  };
};
