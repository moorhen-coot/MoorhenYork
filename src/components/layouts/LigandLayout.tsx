import { MoorhenContainer, MoorhenMolecule, MoorhenReduxStore, addMolecule } from 'moorhen'
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const LigandLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)
    
    const originState = useSelector((state: moorhen.State) => state.glRef.origin)
    const background_colour = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)

    const { ligandName } = useParams()

    const urlPrefix = "/baby-gru"
    const baseUrl = 'https://raw.githubusercontent.com/MRC-LMB-ComputationalStructuralBiology/monomers/master'
    const pdbeBaseUrl = 'https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2'

    const loadLigand = async (ligandName: string) => {
        if (!commandCentre.current) {
            console.warn('Empty glRef or commandCentre, doing nothing...')
            return
        } else if (!ligandName) {
            console.warn('Empty ligand name, doing nothing...')
            return
        }
        
        const anyMolNo = -999999
        const newMolecule = new MoorhenMolecule(commandCentre, glRef, MoorhenReduxStore, baseUrl)

        const url = `${baseUrl}/${ligandName.toLowerCase()[0]}/${ligandName.toUpperCase()}.cif`
        const response = await fetch(url);
        let dictContent: string
        if (response.ok) {
            dictContent = await response.text();
        } else {
            const url2 = `${pdbeBaseUrl}/${ligandName.toUpperCase()}.cif`
            const response2 = await fetch(url2);
            if (response2.ok) {
                dictContent = await response2.text();
            } else {
                console.log(`Unable to fetch ligand dictionary ${ligandName}`)
                return
            }
        }
        
        await commandCentre.current.cootCommand({
            returnType: "status",
            command: 'read_dictionary_string',
            commandArgs: [dictContent, anyMolNo],
        }, false)
        
        const result = await commandCentre.current.cootCommand({
            returnType: 'status',
            command: 'get_monomer_and_position_at',
            commandArgs: [ligandName, anyMolNo,
                ...originState.map(coord => -coord)
            ]
        }, true) as moorhen.WorkerResponse<number>
        
        if (result.data.result.status === "Completed" && result.data.result.result !== -1) {
            newMolecule.molNo = result.data.result.result
            newMolecule.name = ligandName
            newMolecule.setBackgroundColour(background_colour)
            newMolecule.defaultBondOptions.smoothness = defaultBondSmoothness
            newMolecule.coordsFormat = 'mmcif'
            await newMolecule.fetchIfDirtyAndDraw('ligands')
            dispatch( addMolecule(newMolecule) )
        } else {
            console.warn('Error getting monomer... Missing dictionary?')
        }
    }

    useEffect(() => {
        if (cootInitialized && ligandName) {
            loadLigand(ligandName)
        }
    }, [ligandName, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
