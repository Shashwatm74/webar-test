# WebAR Cross-Platform 3D Model Viewer

A Next.js application that provides cross-platform 3D model rendering with AR support for both iOS and Android devices.

## Features

### ✅ Cross-Platform Support
- **iOS**: Uses `@google/model-viewer` for optimal 3D model display and AR integration
- **Android**: Uses Three.js with WebXR for full AR functionality
- **Automatic device detection** using `navigator.userAgent`

### ✅ iOS Implementation
- **Identical to Android**: Exact same user experience as ARscenes.tsx
- **Black Screen + Model**: Loads with model on black background (like Android)
- **START AR Button**: Same button style and behavior as Android WebXR
- **Tap-to-Place**: Identical interaction - tap START AR, then tap to place
- **Simple Setup**: Minimal model-viewer configuration
- **Works in Safari/Chrome**: Direct camera access when AR button tapped

### ✅ Android Implementation
- Three.js WebXR scene with hit-testing
- Touch controls (pinch-to-zoom, drag-to-move, double-tap to reset)
- Full AR placement and interaction features
- WebXR-compatible AR experience

### ✅ Model Support
- **GLB files**: Supported on both platforms
- **USDZ files**: Can be added for enhanced iOS AR experience (optional)
- Automatic fallbacks and error handling

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd webar-test

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development
```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Usage

### Basic Implementation

The app automatically detects the user's device and renders the appropriate component:

```tsx
import SimpleIOSAR from "./components/SimpleIOSAR";
import ARScene from "./components/ARscenes";

// Device detection happens automatically
{isIOS ? (
  <SimpleIOSAR
    src="/model.glb"
    alt="3D Model"
    style={{ width: "100%", height: "100%" }}
  />
) : (
  <ARScene />
)}
```

### Model Files

Place your 3D models in the `public/` directory:
- `model.glb` - Primary model file (works on both platforms)
- `model.usdz` - Optional iOS-optimized model for better AR experience

### Testing Device Detection & Camera Access

Visit `/test` to see:
- Device detection results and user agent
- AR capability testing
- Camera permission status testing
- Platform-specific troubleshooting tips

## Architecture

### Components

1. **`app/page.tsx`** - Main component with device detection logic
2. **`app/components/SimpleIOSAR.tsx`** - Simple iOS AR viewer (Android-like experience)
3. **`app/components/ARscenes.tsx`** - Android Three.js AR implementation
4. **`app/test/page.tsx`** - Device detection and camera permission test page

_Legacy components available:_
- **`app/components/IOSARViewer.tsx`** - Enhanced iOS AR viewer with camera access
- **`app/components/ModelViewer.tsx`** - Alternative iOS model-viewer wrapper

### Device Detection Logic

```tsx
const [isIOS, setIsIOS] = useState(false);

useEffect(() => {
  const ua = navigator.userAgent;
  setIsIOS(/iPad|iPhone|iPod/.test(ua));
}, []);
```

### Key Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **iOS 3D**: `@google/model-viewer`
- **Android AR**: Three.js, WebXR
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Browser Support

### iOS
- ✅ Safari 14+
- ✅ Chrome for iOS
- ✅ Firefox for iOS
- ✅ AR Quick Look support

### Android
- ✅ Chrome 79+ (WebXR support)
- ✅ Samsung Internet
- ✅ Firefox Reality
- ⚠️ Requires WebXR-compatible browser for AR features

### Desktop
- ✅ Chrome, Firefox, Safari, Edge
- ⚠️ AR features require mobile device

## Performance Considerations

- **Dynamic imports**: Model-viewer is loaded only on iOS devices
- **SSR handling**: Client-side device detection prevents hydration mismatches
- **Lazy loading**: AR components are dynamically imported
- **Error handling**: Graceful fallbacks for unsupported devices

## Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Other Platforms
The app can be deployed to any platform supporting Node.js:
- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

### Environment Requirements
- HTTPS required for AR features
- WebXR requires secure context
- Camera permissions needed for AR

## Troubleshooting

### Common Issues

1. **AR not working on iOS**
   - Ensure HTTPS is enabled (required for camera access)
   - Check camera permissions in Settings &gt; Safari &gt; Camera
   - Verify model file is accessible and in GLB format
   - Try using Safari instead of other browsers
   - Check the troubleshooting guide at `/docs/ios-troubleshooting.md`

2. **Three.js errors on Android**
   - Check WebXR browser support
   - Ensure camera permissions
   - Verify secure context (HTTPS)

3. **Model not loading**
   - Check file path and size
   - Verify GLB file format
   - Check console for network errors

### Debug Mode

Visit `/test` to see:
- Device detection results
- User agent string
- Platform-specific behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Google Model Viewer team
- Three.js community
- WebXR specification authors
