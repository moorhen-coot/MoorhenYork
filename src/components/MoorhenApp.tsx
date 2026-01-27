
import { ErrorBoundary} from 'moorhen'
import { MoorhenProvider } from 'moorhen';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LayoutProps } from './RouterLayouts';
import { RootLayout } from './layouts/RootLayout';
import { PdbLayout } from './layouts/PdbLayout';
import { AFDBLayout } from './layouts/AFDBLayout';
import { CODLayout } from './layouts/CODLayout';
import { TutorialLayout } from './layouts/TutorialLayout';
import { LigandLayout } from './layouts/LigandLayout';
import { PubChemLayout } from './layouts/PubChemLayout';
import { SmilesLayout } from './layouts/SmilesLayout';
import { GalleryLayout } from './layouts/GalleryLayout';
import { GallerySessionLayout } from './layouts/GallerySessionLayout';

import React from 'react'

export const MoorhenApp: React.FC = () => {

    const rootPrefix = "/dev"
    const urlPrefix = "/dev/MoorhenAssets"
    const layoutProps: LayoutProps = { urlPrefix:urlPrefix, rootPrefix:rootPrefix}

    const router = createBrowserRouter(
        [
            {
                path: rootPrefix+"",
                element: <RootLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/",
                element: <RootLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/pdb/:pdbId",
                element: <PdbLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/:pdbId",
                element: <PdbLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/tutorial/:tutorialNumber",
                element: <TutorialLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/smiles/:smilesSearch",
                element: <SmilesLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/pubchem/:pubChemSearch",
                element: <PubChemLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/ligand/:ligandName",
                element: <LigandLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/lig/:ligandName",
                element: <LigandLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/monomer/:ligandName",
                element: <LigandLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/afdb/:uniprotID",
                element: <AFDBLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/codsearch/:codid",
                element: <CODLayout {...layoutProps}/>,
            },
            {
                path: rootPrefix+"/gallery",
                element:  <Outlet />,
                children: [
                    {
                        path: "",
                        element: <GalleryLayout {...layoutProps}/>
                    },
                    {
                        index: true,
                        path: ":galleryId",
                        element: <GallerySessionLayout {...layoutProps}/>
                    }
                ]
            },
        ]
    )

    return <React.StrictMode>
                <ErrorBoundary >
                    <div className="App">
                    <MoorhenProvider>
                         <RouterProvider router={router} />
                    </MoorhenProvider>
                    </div>
                </ErrorBoundary>
            </React.StrictMode>
};
