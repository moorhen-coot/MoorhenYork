import { MoorhenContainer } from 'moorhen';
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useRef } from 'react';

export const RootLayout: React.FC = () => {

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)
    
    const collectedProps = {
        glRef, commandCentre
    }

    return <MoorhenContainer {...collectedProps} />
}
