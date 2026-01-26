import { MoorhenContainer, MoorhenMolecule, MoorhenMap, addMolecule, addMap, setActiveMap, MoorhenReduxStore } from 'moorhen'
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const PdbLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)
    const backgroundColor = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)
    
    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)

    const { pdbId } = useParams()

    const urlPrefix = "/baby-gru"
    const baseUrl = 'https://www.ebi.ac.uk/pdbe/entry-files'
    const monomerLibraryPath = "https://raw.githubusercontent.com/MRC-LMB-ComputationalStructuralBiology/monomers/master/"

    const fetchMolecule = async (url: string, molName: string) => {
        const newMolecule = new MoorhenMolecule(commandCentre, glRef, MoorhenReduxStore, monomerLibraryPath)
        newMolecule.setBackgroundColour(backgroundColor)
        newMolecule.defaultBondOptions.smoothness = defaultBondSmoothness
        try {
            await newMolecule.loadToCootFromURL(url, molName)
            if (newMolecule.molNo === -1) {
                throw new Error("Cannot read the fetched molecule...")
            } 
            await newMolecule.fetchIfDirtyAndDraw('CRs')
            await newMolecule.addRepresentation('ligands', '/*/*/*/*')
            await newMolecule.centreOn('/*/*/*/*', true, true)
            dispatch(addMolecule(newMolecule))
        } catch (err) {
            console.warn(err)
            console.warn(`Cannot fetch PDB entry from ${url}, doing nothing...`)
        }
    }

    const fetchMap = async (url: string, mapName: string, isDiffMap: boolean = false) => {
        const newMap = new MoorhenMap(commandCentre, glRef, MoorhenReduxStore)
        try {
            await newMap.loadToCootFromMapURL(url, mapName, isDiffMap)
            if (newMap.molNo === -1) throw new Error("Cannot read the fetched map...")
            dispatch(addMap(newMap))
            dispatch(setActiveMap(newMap))
        } catch (err) {
            console.warn(err)
            console.warn(`Cannot fetch map from ${url}`)
        }
        return newMap
    }

    const loadData = async (pdbCode: string) => {
        await fetchMolecule(`${baseUrl}/download/${pdbCode}.cif`, pdbCode)
        await fetchMap(`${baseUrl}/${pdbCode}_diff.ccp4`, `${pdbCode}-FoFc`, true)
        await fetchMap(`${baseUrl}/${pdbCode}.ccp4`, `${pdbCode}-2FoFc`)
    }

    useEffect(() => {
        if (cootInitialized && pdbId) {
            loadData(pdbId.toLowerCase())
        }
    }, [pdbId, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
