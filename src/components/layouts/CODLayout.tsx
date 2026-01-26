import { MoorhenContainer, MoorhenMolecule, MoorhenReduxStore, addMolecule } from 'moorhen'
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { libcootApi } from "moorhen/types/libcoot"
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const CODLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)

    const background_colour = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)

    const { codid } = useParams()

    const urlPrefix = "/baby-gru"
    //const baseUrl = 'https://www.crystallography.net/cod'
    const baseUrl = '/cod'

    const loadCOD = async (codid: string) => {

        if (!commandCentre.current) {
            console.warn('Empty commandCentre, doing nothing...')
            return
        } else if (!codid) {
            console.warn('Empty codid string, doing nothing...')
            return
        }

        const url = `${baseUrl}/${codid}.cif`
        console.error("url:")
        console.error(url)
        const response = await fetch(url)
        console.error("response:")
        console.error(response)
        const coordData = await response.text()
        console.error("coordData:")
        console.error(coordData)

        const anyMolNo = -999999

        const cod_to_cif_response = await commandCentre.current.cootCommand({
            command: 'SmallMoleculeCifToMMCif',
            commandArgs: [coordData],
            returnType: 'str_str_pair'
        }, true) as moorhen.WorkerResponse<libcootApi.PairType<string, string>>

        const dictContent = cod_to_cif_response.data.result.result.second
        const coordContent = cod_to_cif_response.data.result.result.first

        await commandCentre.current.cootCommand({
            returnType: "status",
            command: 'read_dictionary_string',
            commandArgs: [dictContent, anyMolNo],
        }, false)

        const newMolecule = new MoorhenMolecule(commandCentre, glRef, MoorhenReduxStore, baseUrl)
        const result = await newMolecule.loadToCootFromString(coordContent, codid);
        console.error(result)

        if (result) {
            newMolecule.name = codid
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
        if (cootInitialized && codid) {
            loadCOD(codid)
        }
    }, [codid, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
