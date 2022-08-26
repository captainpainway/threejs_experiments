import './App.css';
import React, {useState, useRef, Suspense} from 'react';
import {Canvas} from "@react-three/fiber";
import Sphere from "./Sphere";
import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from "@material-ui/icons/Pause";
import {PositionalAudio} from '@react-three/drei';
import {EffectComposer, Bloom, SMAA} from '@react-three/postprocessing';

function App() {
    const sound = useRef();
    const [play, setPlay] = useState(true);

    // Adding spheres in a circle.
    function createSpheres() {
        const number = 20,
            increase = Math.PI * 2 / number;
        let angle = Math.PI / 2;
        let spheres = []; // The array of spheres to pass to the canvas.

        for (let i = 0; i < number; i++) {
            let x = 5 * Math.cos(angle);
            let y = 5 * Math.sin(angle);
            let key = `sphere_${i}`;
            // I want the spheres to be a nice loop, so the index goes up to number / 2,
            // then back down.
            let idx = i < number / 2 ? i : number - i;
            spheres.push(<Sphere
                key={key}
                position={[x, y, -10]}
                radius={0.25}
                angle={angle}
                sound={sound}
                index={idx}
            />);
            angle += increase;
        }
        return spheres;
    }

    // Added a button to pause the music.
    function playMusic() {
        if (play) {
            sound.current.pause();
        } else {
            sound.current.play();
        }
        setPlay(!play);
    }

    return (
        <div className="App">
            <Canvas>
                <ambientLight intensity={0.2} />
                <directionalLight position={[0, 0, 5]} />
                <Suspense fallback={null}>
                    <PositionalAudio
                        url='./Riviere.mp3'
                        distance={10}
                        loop
                        ref={sound}
                    />
                    {createSpheres()}
                    <EffectComposer multisampling={0}>
                        <Bloom intensity={0.5} luminanceThreshold={0} luminanceSmoothing={0.8} />
                        <SMAA />
                    </EffectComposer>
                </Suspense>
            </Canvas>
            <Fab size="small" color="primary" aria-label="play" style={{
                position: 'absolute',
                top: 20,
                left: 20
            }} onClick={playMusic}>
                {!play ?
                <PlayArrowIcon /> :
                <PauseIcon />}
            </Fab>
        </div>
    );
}

export default App;
