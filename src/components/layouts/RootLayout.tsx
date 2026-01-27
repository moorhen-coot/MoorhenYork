import { MoorhenContainer } from 'moorhen';
import { LayoutProps } from '../RouterLayouts';
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useRef } from 'react';

export const RootLayout: React.FC<LayoutProps> = (props) => {

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)
    const urlPrefix = props.urlPrefix
    
    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
