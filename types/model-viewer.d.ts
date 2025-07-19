declare module '@google/model-viewer' {
  export class ModelViewerElement extends HTMLElement {
    src: string;
    alt: string;
    ar: boolean;
    'ar-modes': string;
    'auto-rotate': boolean;
    'camera-controls': boolean;
    'tone-mapping': string;
    'shadow-intensity': string;
    'interaction-prompt': string;
    'ios-src': string;
    poster: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'tone-mapping'?: string;
        'shadow-intensity'?: string;
        'interaction-prompt'?: string;
        'ios-src'?: string;
        poster?: string;
        loading?: string;
        reveal?: string;
        'auto-rotate-delay'?: string;
        'rotation-per-second'?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
    }
  }
}
