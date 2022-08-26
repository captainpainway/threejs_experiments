import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import {useFrame} from "@react-three/fiber";

function Sphere(props) {
    const mesh = useRef();
    let number = 360;

    const sphereColor = () => {
        // Rainbow colors.
        let r, g, b;
        r = parseInt((Math.sin(props.angle - Math.PI) + 1) * 128);
        g = parseInt((Math.sin((props.angle - Math.PI) - 4 * Math.PI / 3) + 1) * 128);
        b = parseInt((Math.sin((props.angle - Math.PI) - 2 * Math.PI / 3) + 1) * 128);
        return new THREE.Color(`rgb(${r}, ${g}, ${b})`);
    }

    const scale = (number, inMin, inMax, outMin, outMax) => {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };

    function Analyser({sound}) {
        const analyser = useRef();

        useEffect(() => {
            analyser.current = new THREE.AudioAnalyser(sound.current, 128);
        }, [sound]);

        useFrame(() => {
            if (analyser.current) {
                let data = analyser.current.getFrequencyData();
                mesh.current.scale.x =
                    mesh.current.scale.y =
                        mesh.current.scale.z = scale(data[props.index * 3], 0, 255, 0.5, 1.5);

                // let movement = scale(data[props.index * 3], 0, 255, 3, 10);
                // let x = movement * Math.cos(props.angle);
                // let y = movement * Math.sin(props.angle);
                // mesh.current.position.x = x;
                // mesh.current.position.y = y;
            }
        });

        return <></>;
    }

    return (
        <>
            <mesh position={props.position} ref={mesh}>
                <sphereGeometry
                    args={[props.radius / 10, 50, 50]}
                />
                <meshPhongMaterial color={sphereColor()} />
            </mesh>
            <Analyser sound={props.sound} />
        </>
);
}

export default Sphere;
