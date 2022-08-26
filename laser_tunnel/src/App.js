import './App.css';
import React, {useState} from 'react';
import * as THREE from 'three';
import {Canvas, useLoader} from '@react-three/fiber';

function App() {
    const [curve] = useState(() => {
        let points = [];
        for (let i = 0; i < 20; i += 2) {
            points.push(new THREE.Vector3(0, 0, i));
        }
        return new THREE.CatmullRomCurve3(points);
    });

    const texture = useLoader(THREE.TextureLoader, "./tunnel_texture.png");

    return (
        <div id='canvas-container'>
            <Canvas camera={{position: [0, 0, 18]}}>
                <ambientLight intensity={0.1} />
                <pointLight color="blue" position={[0, 1, 18]} intensity={1} />
                    <mesh>
                        <tubeGeometry args={[curve, 70, 2, 50, false]} />
                        <meshStandardMaterial
                            color="teal"
                            side={THREE.BackSide}
                            map={texture}
                        />
                    </mesh>
            </Canvas>
        </div>
    );
}

export default App;
