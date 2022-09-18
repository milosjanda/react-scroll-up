declare module 'react-scroll-up' {
  import React, { ReactNode } from 'react';

  export interface ScrollToTopProps {
    showUnder: number,
    topPosition?: number,
    easing?: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' |
      'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' |
      'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' |
      'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInElastic' | 'easeOutElastic' |
      'easeInOutElastic' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack' | 'easeInBounce' | 'easeOutBounce' |
      'easeInOutBounce',
    duration?: number,
    style?: object,
    onShow?: () => void,
    onHide?: () => void,
    children?: ReactNode
  }

  export default class ScrollToTop extends React.Component<ScrollToTopProps, any> {}
}
