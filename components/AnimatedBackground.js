import React, { Component } from 'react'

import ParticlesBg from 'particles-bg'

class AnimatedBackground extends Component {
  render () {
      let config = {
          num: [5, 7],
          rps: 0.1,
          radius: [5, 40],
          life: [1.5, 3],
          v: [2, 9],
          tha: [-40, 40],
          // body: "./img/icon.png", // Whether to render pictures
          rotate: [0, 20],
          alpha: [0.6, 0],
          scale: [1, 0.1],
          position: "center", // all or center or {x:1,y:1,width:100,height:100}
        //   color: ["#111111", "#ff0000"],
          cross: "cross", // cross or bround
          random: 15,  // or null,
          g: 1,    // gravity
          // f: [2, -1], // force
          onParticleUpdate: (ctx, particle) => {
              ctx.beginPath();
              ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
              ctx.fillStyle = particle.color;
              ctx.fill();
              ctx.closePath();
          }
        };
    return (
      <div>
      <ParticlesBg color="#555555" type="cobweb" config={config} bg={true} />
      </div>
    )
  }
}
export default AnimatedBackground;