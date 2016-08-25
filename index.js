/**
 * @author  Milos Janda
 * @licence MIT
 */

'use strict';

var React = require('react');
var TweenFunctions = require('tween-functions');
var objectAssign = require('object-assign');

var ScrollUp = React.createClass({
    displayName: 'ScrollUp',

    data: {
        startValue: 0,
        currentTime: 0, // store current time of animation
        startTime: null,
        rafId: null
    },

    propTypes: {
        topPosition: React.PropTypes.number,
        showUnder: React.PropTypes.number.isRequired, // show button under this position,
        easing: React.PropTypes.oneOf(['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce']),
        duration: React.PropTypes.number, // seconds
        style: React.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
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
    },
    getInitialState: function getInitialState() {
        return {
            show: false
        };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return nextState.show !== this.state.show;
    },
    componentDidMount: function componentDidMount() {
        this.handleScroll(); // initialize state
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("wheel", this.stopScrolling, false);
        window.addEventListener("touchstart", this.stopScrolling, false);
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener("wheel", this.stopScrolling, false);
        window.removeEventListener("touchstart", this.stopScrolling, false);
    },

    handleScroll: function handleScroll() {
        if (window.pageYOffset > this.props.showUnder) {
            this.setState({ show: true });
        } else {
            this.setState({ show: false });
        }
    },
    handleClick: function handleClick() {
        this.stopScrolling();
        this.data.startValue = window.pageYOffset;
        this.data.currentTime = 0;
        this.data.startTime = null;
        this.data.rafId = window.requestAnimationFrame(this.scrollStep);
    },

    scrollStep: function scrollStep(timestamp) {
        if (!this.data.startTime) {
            this.data.startTime = timestamp;
        }

        this.data.currentTime = timestamp - this.data.startTime;

        var position = TweenFunctions[this.props.easing](this.data.currentTime, this.data.startValue, this.props.topPosition, this.props.duration);

        if (window.pageYOffset <= this.props.topPosition) {
            this.stopScrolling();
        } else {
            window.scrollTo(window.pageXOffset, position);
            this.data.rafId = window.requestAnimationFrame(this.scrollStep);
        }
    },

    stopScrolling: function stopScrolling() {
        window.cancelAnimationFrame(this.data.rafId);
    },

    render: function render() {
        var propStyle = this.props.style;
        var element = React.createElement(
            'div',
            { style: propStyle, onClick: this.handleClick },
            this.props.children
        );

        var style = objectAssign({}, propStyle);
        style.opacity = this.state.show ? 1 : 0;
        style.visibility = this.state.show ? 'visible' : 'hidden';
        style.transitionProperty = 'opacity, visibility';

        return React.cloneElement(element, { style: style });
    }
});

module.exports = ScrollUp;
