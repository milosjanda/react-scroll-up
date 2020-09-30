/**
 * @author  Milos Janda
 * @licence MIT
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TweenFunctions from 'tween-functions';
import detectPassiveEvents from 'detect-passive-events';
import objectAssign from 'object-assign';

export default class ScrollUp extends React.Component {

    constructor(props) {
        super(props);

        // set default state
        this.state = {show: false};

        // default property `data`
        this.data = {
            startValue: 0,
            currentTime: 0, // store current time of animation
            startTime: null,
            rafId: null
        };

        // bind
        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.scrollStep = this.scrollStep.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.show !== this.state.show;
    }

    componentDidMount() {
        this.handleScroll(); // initialize state

        // Add all listeners which can start scroll
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("wheel", this.stopScrolling, detectPassiveEvents.hasSupport ? {passive: true} : false);
        window.addEventListener("touchstart", this.stopScrolling, detectPassiveEvents.hasSupport ? {passive: true} : false);
    }

    componentWillUnmount() {
        // Remove all listeners which was registered
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener("wheel", this.stopScrolling, false);
        window.removeEventListener("touchstart", this.stopScrolling, false);
    }

    /**
     * call onShow callback if passed valid props
     */
    notifyOnShow() {
        if (this.props.onShow && typeof this.props.onShow === "function") {
            this.props.onShow();
        }
    }

    /**
     * call onHide callback if passed valid props
     */
    notifyOnHide() {
        if (this.props.onHide && typeof this.props.onHide === "function") {
            this.props.onHide();
        }
    }

    /**
     * Evaluate show/hide this component, depend on new position
     */
    handleScroll() {
        if (window.pageYOffset > this.props.showUnder) {
            if (!this.state.show) {
                this.setState({show: true});
                this.notifyOnShow();
            }
        } else {
            if (this.state.show) {
                this.setState({show: false});
                this.notifyOnHide();
            }
        }
    }

    /**
     * Handle click on the button
     */
    handleClick() {
        this.stopScrolling();
        this.data.startValue = window.pageYOffset;
        this.data.currentTime = 0;
        this.data.startTime = null;
        this.data.rafId = window.requestAnimationFrame(this.scrollStep);
    }


    /**
     * Calculate new position
     * and scroll screen to new position or stop scrolling
     * @param timestamp
     */
    scrollStep(timestamp) {
        if (!this.data.startTime) {
            this.data.startTime = timestamp;
        }

        this.data.currentTime = timestamp - this.data.startTime;

        let position = TweenFunctions[this.props.easing](
            this.data.currentTime,
            this.data.startValue,
            this.props.topPosition,
            this.props.duration
        );

        if (window.pageYOffset <= this.props.topPosition) {
            this.stopScrolling();
        } else {
            window.scrollTo(window.pageYOffset, position);
            this.data.rafId = window.requestAnimationFrame(this.scrollStep);
        }
    }

    /**
     * Stop Animation Frame
     */
    stopScrolling() {
        window.cancelAnimationFrame(this.data.rafId);
    }

    /**
     * Render component
     */
    render() {

        let propStyle = this.props.style;
        let element =
            <div style={propStyle} onClick={this.handleClick}>
                {this.props.children}
            </div>;

        let style = objectAssign({}, ScrollUp.defaultProps.style);
        style = objectAssign(style, propStyle);
        style.opacity = (this.state.show ? 1 : 0);
        style.visibility = (this.state.show ? 'visible' : 'hidden');
        style.transitionProperty = 'opacity, visibility';

        return React.cloneElement(element, {style: style});
    }
}


// Set default props
ScrollUp.defaultProps = {
    duration: 250,
    easing: 'easeOutCubic',
    style: {
        position: 'fixed',
        bottom: 50,
        right: 30,
        cursor: 'pointer',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'linear',
        transitionDelay: '0s'
    },
    topPosition: 0
};

// Set validation property types
ScrollUp.propTypes = {
    topPosition: PropTypes.number,
    showUnder: PropTypes.number.isRequired, // show button under this position,
    easing: PropTypes.oneOf(['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic',
        'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint',
        'easeOutQuint', 'easeInOutQuint', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo',
        'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic', 'easeOutElastic',
        'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce',
        'easeInOutBounce']),
    duration: PropTypes.number, // seconds
    style: PropTypes.object,
    onShow: PropTypes.func,
    onHide: PropTypes.func
};
