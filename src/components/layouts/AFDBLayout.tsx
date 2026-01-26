import { MoorhenContainer, MoorhenMolecule, addMolecule, MoorhenReduxStore, MoorhenColourRule, getMultiColourRuleArgs } from 'moorhen'
import { webGL } from 'moorhen/types/mgWebGL';
import { moorhen } from 'moorhen/types/moorhen';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export const AFDBLayout: React.FC = () => {
    const dispatch = useDispatch()
    const cootInitialized = useSelector((state: moorhen.State) => state.generalStates.cootInitialized)
    const defaultBondSmoothness = useSelector((state: moorhen.State) => state.sceneSettings.defaultBondSmoothness)
    const backgroundColor = useSelector((state: moorhen.State) => state.sceneSettings.backgroundColor)

    const glRef = useRef<webGL.MGWebGL | null>(null)
    const commandCentre = useRef<moorhen.CommandCentre | null>(null)

    const { uniprotID } = useParams()

    const urlPrefix = "/baby-gru"
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
            const newColourRule = new MoorhenColourRule(
                'af2-plddt', "/*/*/*/*", "#ffffff", commandCentre, true
            )
            newColourRule.setLabel("PLDDT")
            const ruleArgs = await getMultiColourRuleArgs(newMolecule, 'af2-plddt')
            newColourRule.setArgs([ ruleArgs ])
            newColourRule.setParentMolecule(newMolecule)
            newMolecule.defaultColourRules = [ newColourRule ]

            await newMolecule.fetchIfDirtyAndDraw('CRs')
            await newMolecule.addRepresentation('ligands', '/*/*/*/*')
            await newMolecule.centreOn('/*/*/*/*', true, true)

            dispatch(addMolecule(newMolecule))
        } catch (err) {
            console.warn(err)
            console.warn(`Cannot fetch PDB entry from ${url}, doing nothing...`)
        }
    }

    const loadData = async (uniprotID: string) => {

        const uniprotIDUpper: string = uniprotID.toUpperCase()
        const coordUrl = `https://alphafold.ebi.ac.uk/files/AF-${uniprotIDUpper}-F1-model_v4.pdb`
        await fetchMolecule(coordUrl, uniprotIDUpper)
    }

    useEffect(() => {
        if (cootInitialized && uniprotID) {
            loadData(uniprotID.toLowerCase())
        }
    }, [uniprotID, cootInitialized])

    const collectedProps = {
        glRef, commandCentre, urlPrefix
    }

    return <MoorhenContainer {...collectedProps} />
}
