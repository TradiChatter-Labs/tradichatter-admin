// Layer 2 Safety Error Class
// Internal error class to prevent accidental Layer 1 execution
// DESIGN-ONLY - NO RUNTIME EFFECT

class Layer2SafetyError extends Error {
  constructor(message = 'Layer 2 is in DESIGN_ONLY mode - Layer 1 execution blocked') {
    super(message);
    this.name = 'Layer2SafetyError';
    this.layer = 2;
    this.mode = 'DESIGN_ONLY';
    this.reason = 'Layer 1 security system is frozen';
  }
}

module.exports = { Layer2SafetyError };