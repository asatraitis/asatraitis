import { useEffect, useRef } from "react";
import { useActor } from "@xstate/react";
import './background.css';

export default function Background({threeActor}) {
    const [_, send] = useActor(threeActor)
    const canvasRef = useRef(null)

    useEffect(() => {
        // TODO: Need to handle "cleanup"
        if (canvasRef.current) {
            send({type: 'INIT', canvasRef: canvasRef.current})
        }
    }, [canvasRef.current])

    return (
        <div className="app-background"><canvas ref={canvasRef} /></div>
    )
}