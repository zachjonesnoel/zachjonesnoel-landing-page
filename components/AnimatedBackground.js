import React, { Component } from 'react'

import Particles from 'react-particles-js';

class AnimatedBackground extends Component {
  render () {
       let config={
	    "particles": {
	        "number": {
	            "value": 120
	        },
	        "size": {
	            "value": 2
	        },
	        "color": {
            "value": "#111",
            "animation": {
              "h": {
                "count": 0,
                "enable": true,
                "offset": 0,
                "speed": 50,
                "sync": false
              },
              "s": {
                "count": 0,
                "enable": false,
                "offset": 0,
                "speed": 1,
                "sync": true
              },
              "l": {
                "count": 0,
                "enable": false,
                "offset": 0,
                "speed": 1,
                "sync": true
              }
            }
          },
          "links": {
            "color": {
              "value": "#888"
            },
          }
	    },
	    "interactivity": {
	        "events": {
	            "onhover": {
	                "enable": false,
	                "mode": "repulse"
	            }
	        }
	    },
	    
  
      "fullScreen": {
        "enable": true,
        "zIndex": -1
      },
	};
    return (
      <Particles params={config} />
    )
  }
}
export default AnimatedBackground;