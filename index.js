/**
 * @author  Milos Janda
 * @licence MIT
 */

'use strict';

var React = require('react');
var TweenFunctions = require('tween-functions');

var ScrollUp = React.createClass({displayName: "ScrollUp",

        data: {
            startValue: 0,
            currentTime: 0, // store current time of animation
            interval: null,  // store interval reference
            intervalTime: 20 // how often calculate new position
        },

        propTypes: {
            topPosition: React.PropTypes.number,
            showUnder: React.PropTypes.number.isRequired, // show button under this position,
            easing: React.PropTypes.oneOf(['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic',
                'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint',
                'easeOutQuint', 'easeInOutQuint', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo',
                'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic', 'easeOutElastic',
                'easeInOutElastic', 'easeInBack','easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce',
                'easeInOutBounce']),
            duration: React.PropTypes.number, // seconds
            style: React.PropTypes.object
        },

        getDefaultProps: function() {
            return {
                duration: 250,
                easing: 'easeInCubic',
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
            }
        },
        getInitialState: function() {
            return {
                show: false
            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            return nextState.show !== this.state.show;
        },
        componentDidMount: function() {
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener("wheel", this.stopScrolling, false);
        },

        componentWillUnmount: function() {
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener("wheel", this.stopScrolling, false);
        },

        handleScroll: function() {
            if (window.scrollY > this.props.showUnder) {
                this.setState({show: true});
            } else {
                this.setState({show: false});
            }
        },
        handleClick: function() {
            this.stopScrolling();
            this.data.startValue = window.scrollY;
            this.data.currentTime = 0;

            var that = this;
            this.data.interval = setInterval(function() {

                /**
                 * TweenFunctions[that.props.easing] = function(t, b, _c, d) {...}
                 * t: current time, b: beginning value, _c: final value, d: total duration
                 *
                 */
                var position = TweenFunctions[that.props.easing](
                    that.data.currentTime,
                    that.data.startValue,
                    that.props.topPosition,
                    that.props.duration
                );

                if (position == that.props.topPosition ) {
                    that.stopScrolling();
                }
                that.data.currentTime = that.data.currentTime + that.data.intervalTime;
                window.scrollTo(window.scrollY,position);

            }, this.data.intervalTime);
        },

        stopScrolling: function() {
            clearInterval(this.data.interval);
        },

        render: function() {
            var style = this.props.style;
            style.opacity = this.state.show ? 1 : 0;
            style.transitionProperty = 'opacity';


            return (
                React.createElement("div", {style: style, onClick: this.handleClick}, 
        this.props.children
    )
)
}
});

module.exports = ScrollUp;
