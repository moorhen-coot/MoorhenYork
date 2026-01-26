import { MoorhenContainer, MoorhenMolecule, MoorhenMap, addMolecule, setActiveMap, addMapList, MoorhenReduxStore } from 'moorhen';
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const TutorialLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)
    const backgroundColor = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)
    
    const { tutorialNumber } = useParams()

    const urlPrefix = "/baby-gru"
    const monomerLibraryPath = "https://raw.githubusercontent.com/MRC-LMB-ComputationalStructuralBiology/monomers/master/"
    const baseUrl = 'https://raw.githubusercontent.com/moorhen-coot/moorhen/master/baby-gru/public/baby-gru/tutorials'

    const tutorialMtzColumnNames: { [key: string]: any } = {
        1: { F: "FWT", PHI: "PHWT", Fobs: 'FP', SigFobs: 'SIGFP', FreeR: 'FREE' },
        2: { F: "FWT", PHI: "PHWT", Fobs: 'FP', SigFobs: 'SIGFP', FreeR: 'FREE' },
        3: { F: "FWT", PHI: "PHWT", Fobs: 'F', SigFobs: 'SIGF', FreeR: 'FREER' }
    }

    const loadTutorial = async (tutorialNumber: string) => {
        if ( !(tutorialNumber in tutorialMtzColumnNames) ) {
            console.warn('Invalid tutorial number, doing nothing...')
            return
        }
        const newMolecule = new MoorhenMolecule(commandCentre, glRef, MoorhenReduxStore, monomerLibraryPath)
        newMolecule.setBackgroundColour(backgroundColor)
        newMolecule.defaultBondOptions.smoothness = defaultBondSmoothness
        const newMap = new MoorhenMap(commandCentre, glRef, MoorhenReduxStore)
        const newDiffMap = new MoorhenMap(commandCentre, glRef, MoorhenReduxStore)
        await newMolecule.loadToCootFromURL(`${baseUrl}/moorhen-tutorial-structure-number-${tutorialNumber}.pdb`, `mol-${tutorialNumber}`)
        await newMolecule.fetchIfDirtyAndDraw('CBs')
        await newMolecule.centreOn('/*/*/*/*', false)
        await newMap.loadToCootFromMtzURL(
            `${baseUrl}/moorhen-tutorial-map-number-${tutorialNumber}.mtz`,
            `map-${tutorialNumber}`,
            { F: "FWT", PHI: "PHWT", isDifference: false, useWeight: false, calcStructFact: true, ...tutorialMtzColumnNames[tutorialNumber] }
        )
        await newDiffMap.loadToCootFromMtzURL(
            `${baseUrl}/moorhen-tutorial-map-number-${tutorialNumber}.mtz`,
            `diff-map-${tutorialNumber}`,
            { ...tutorialMtzColumnNames[tutorialNumber], F: "DELFWT", PHI: "PHDELWT", isDifference: true, useWeight: false, calcStructFact: true }
        )
        dispatch( addMolecule(newMolecule) )
        dispatch( addMapList([newMap, newDiffMap]) )
        dispatch( setActiveMap(newMap) )
    }

    useEffect(() => {
        if (cootInitialized && tutorialNumber) {
            loadTutorial(tutorialNumber)
        }
    }, [tutorialNumber, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
