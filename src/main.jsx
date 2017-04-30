import React from 'react';
import ReactDOM from 'react-dom';
import ScrollUp from 'react-scroll-up';

ReactDOM.render(
    <ScrollUp showUnder={20}
              easing={'easeOutCubic'}
              duration={500}>
        <img src='img/up_arrow_round.png'/>
    </ScrollUp>,
    document.getElementById('scroll-component')
);

if (process.env.NODE_ENV === "development") {
    console.log('Development mode')
}
