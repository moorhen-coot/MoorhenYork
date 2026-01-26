
import { ErrorBoundary, MoorhenContainer} from 'moorhen'
import { MoorhenProvider } from 'moorhen';
//import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
//import { RouterProvider, createBrowserRouter } from 'react-router-dom';
/*
import { RootLayout } from './layouts/RootLayout';
import { PdbLayout } from './layouts/PdbLayout';
import { AFDBLayout } from './layouts/AFDBLayout';
import { CODLayout } from './layouts/CODLayout';
//import { TutorialLayout } from './layouts/TutorialLayout';
import { LigandLayout } from './layouts/LigandLayout';
import { PubChemLayout } from './layouts/PubChemLayout';
import { SmilesLayout } from './layouts/SmilesLayout';
//import { GalleryLayout } from './layouts/GalleryLayout';
//import { GallerySessionLayout } from './layouts/GallerySessionLayout';
*/
import React from 'react'

export const MoorhenApp: React.FC = () => {

    const urlPrefix = "/dev/MoorhenAssets"
/*
    const router = createBrowserRouter(
        [
            {
                path: "",
                element: <RootLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/",
                element: <RootLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/pdb/:pdbId",
                element: <PdbLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/:pdbId",
                element: <PdbLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/tutorial/:tutorialNumber",
                element: <TutorialLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/smiles/:smilesSearch",
                element: <SmilesLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/pubchem/:pubChemSearch",
                element: <PubChemLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/ligand/:ligandName",
                element: <LigandLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/lig/:ligandName",
                element: <LigandLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/monomer/:ligandName",
                element: <LigandLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/afdb/:uniprotID",
                element: <AFDBLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "/codsearch/:codid",
                element: <CODLayout urlPrefix={urlPrefix}/>,
            },
            {
                path: "gallery",
                element:  <Outlet />,
                children: [
                    {
                        path: "",
                        element: <GalleryLayout urlPrefix={urlPrefix}/>
                    },
                    {
                        index: true,
                        path: ":galleryId",
                        element: <GallerySessionLayout urlPrefix={urlPrefix}/>
                    }
                ]
            },
        ]
    )
            */

                            //<RouterProvider router={router} />
    return <React.StrictMode>
                <ErrorBoundary >
                    <div className="App">
                        <MoorhenProvider>
                            <MoorhenContainer urlPrefix={urlPrefix}/>
                        </MoorhenProvider>
                    </div>
                </ErrorBoundary>
            </React.StrictMode>
};
