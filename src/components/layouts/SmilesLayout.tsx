import { MoorhenContainer, MoorhenMolecule, MoorhenReduxStore, addMolecule } from 'moorhen'
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { libcootApi } from "moorhen/types/libcoot"
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const SmilesLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)

    const originState = useSelector((state: moorhen.State) => state.glRef.origin)
    const background_colour = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)

    const { smilesSearch } = useParams()

    const urlPrefix = "/baby-gru"
    const baseUrl = 'https://raw.githubusercontent.com/MRC-LMB-ComputationalStructuralBiology/monomers/master'

    const loadSmiles = async (smilesSearch: string) => {
        if (!commandCentre.current) {
            console.warn('Empty commandCentre, doing nothing...')
            return
        } else if (!smilesSearch) {
            console.warn('Empty smiles string, doing nothing...')
            return
        }

        const smiles_to_pdbResponse = await commandCentre.current.cootCommand({
            command: 'smiles_to_pdb',
            commandArgs: [smilesSearch, "LIG", 10, 100],
            returnType: 'str_str_pair'
        }, true) as moorhen.WorkerResponse<libcootApi.PairType<string, string>>
        const dictContent = smiles_to_pdbResponse.data.result.result.second

        const anyMolNo = -999999
        const newMolecule = new MoorhenMolecule(commandCentre, glRef, MoorhenReduxStore, baseUrl)

        await commandCentre.current.cootCommand({
            returnType: "status",
            command: 'read_dictionary_string',
            commandArgs: [dictContent, anyMolNo],
        }, false)

        const result = await commandCentre.current.cootCommand({
            returnType: 'status',
            command: 'get_monomer_and_position_at',
            commandArgs: ["LIG", anyMolNo,
                ...originState.map(coord => -coord)
            ]
        }, true) as moorhen.WorkerResponse<number>

        if (result.data.result.status === "Completed" && result.data.result.result !== -1) {
            newMolecule.molNo = result.data.result.result
            newMolecule.name = "LIG"
            newMolecule.setBackgroundColour(background_colour)
            newMolecule.defaultBondOptions.smoothness = defaultBondSmoothness
            newMolecule.coordsFormat = 'mmcif'
            await newMolecule.fetchIfDirtyAndDraw("CBs")
            dispatch( addMolecule(newMolecule) )
        } else {
            console.warn('Error getting monomer... Missing dictionary?')
        }
    }

    useEffect(() => {
        if (cootInitialized && smilesSearch) {
            loadSmiles(smilesSearch)
        }
    }, [smilesSearch, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
