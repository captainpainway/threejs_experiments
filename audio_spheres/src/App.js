import './App.css';
import React, {useRef, Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import Sphere from "./Sphere";
import {EffectComposer, Bloom, SMAA} from '@react-three/postprocessing';
import {PositionalAudio} from "@react-three/drei";

function App() {
    const sound = useRef();

    let number = 30;
    let angle = Math.PI / 2;
    let increase = Math.PI * 2 / number;
    let spheres = [];

    for (let i = 0; i < number; i++) {
        let key = `sphere_${i}`;
        let x = 7 * Math.cos(angle);
        let y = 7 * Math.sin(angle);
        let idx = i < (number / 2) ? i : number - i;
        console.log(idx);
        spheres.push(<Sphere
            key={key}
            position={[x, y, -10]}
            radius={5}
            angle={angle}
            sound={sound}
            index={idx}
        />);
        angle += increase;
    }

    return (
        <div className="App">
            <Canvas>
                <ambientLight intensity={0.3} />
                <directionalLight position={[0, 0, 5]} />
                <Suspense fallback={null}>
                    <PositionalAudio
                        url='./Tumbling.mp3'
                        distance={10}
                        loop
                        ref={sound}
                    />
                    {spheres}
                </Suspense>
                <Suspense fallback={null}>
                    <EffectComposer multisampling={0}>
                        <Bloom intensity={0.5} luminanceThreshold={0} luminanceSmoothing={0.9} />
                        <SMAA />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}

export default App;
