# iOS AR Camera Troubleshooting Guide

## Camera Access Issues on iOS

### Prerequisites for iOS AR Camera Access
1. **Device**: iPhone 6s/iPad (2017) or newer
2. **iOS**: Version 11 or later
3. **Browser**: Safari or Chrome
4. **Connection**: HTTPS required (not HTTP)

### Common Issues & Solutions

#### 1. Camera Permission Denied
**Symptoms**: Black screen, no camera feed
**Solutions**:
- Go to Settings > Safari > Camera > Allow
- Go to Settings > Privacy & Security > Camera > Safari > Enable
- Refresh the page after enabling permissions

#### 2. AR Button Not Working
**Symptoms**: Button appears but AR doesn't launch
**Solutions**:
- Ensure you're using Safari (recommended) or Chrome
- Check that WebXR or AR Quick Look is supported
- Try tapping and holding the AR button instead of quick taps

#### 3. Model Loads But No AR
**Symptoms**: 3D model displays but AR functionality missing
**Solutions**:
- Verify the model file is in GLB format
- Check that `ar` attribute is enabled
- Ensure the device supports ARKit

#### 4. Performance Issues
**Symptoms**: Laggy camera feed or slow rendering
**Solutions**:
- Close other apps to free memory
- Use smaller/optimized 3D models
- Ensure good lighting conditions

### Testing Steps

1. **Open in Safari**: Visit the app in iOS Safari
2. **Check Permissions**: Allow camera access when prompted
3. **Test Model Loading**: Verify 3D model loads without AR first
4. **Test AR Button**: Tap the "📱 Launch AR Camera" button
5. **Check Console**: Use Safari Web Inspector for debugging

### Code Implementation Notes

The iOS AR viewer:
- Requests camera permission early
- Uses model-viewer with AR Quick Look
- Supports both WebXR and scene-viewer modes
- Automatically detects iOS devices
- Provides fallback for unsupported devices

### Browser Console Commands for Debugging

```javascript
// Check if AR is supported
navigator.xr?.isSessionSupported('immersive-ar')

// Check camera permissions
navigator.mediaDevices.getUserMedia({video: true})

// Check if model-viewer is loaded
document.querySelector('model-viewer')
```
