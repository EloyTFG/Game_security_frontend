import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';
import NET from 'vanta/src/vanta.net'

const VantaComponent = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    NET({
        el: "#vanta2",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x2488e1,

    })
}, [])


  return <div id='vanta2' style={{ width: '100%', height: '100vh' }} />;
};

export default VantaComponent;