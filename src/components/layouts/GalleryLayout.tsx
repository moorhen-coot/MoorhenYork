//import { Gallery } from "react-grid-gallery";
import  PhotoAlbum from 'react-photo-album';
import { useCallback, useState } from "react";
import "react-photo-album/masonry.css";
import { Box, IconButton, Typography, Modal } from "@mui/material";
import { PlayCircleOutlined } from '@mui/icons-material';

export const GalleryLayout: React.FC = () => {

    const [showModal, setShowModal] = useState<boolean>(false)
    const [imageIndex, setImageIndex] = useState<number>(0)

    let imageData = [
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-cover.png",
        sessionUrl: "/gallery/cover",
        originalWidth: 2214,
        originalHeight: 1720,
        onClickWidth: 221,
        onClickHeight: 172,
        tryItButtonTextColour: 'grey',
        title: "",
        description:<>
        PDB code: <a href="https://www.rcsb.org/structure/...">...</a>.
        <br />
        <strong>Click on the play button to load the Moorhen session!</strong>
      </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-1.png",
        sessionUrl: "/gallery/1",
        originalWidth: 4096,
        originalHeight: 2283,
        onClickWidth: 409,
        onClickHeight: 228,
        tryItButtonTextColour: 'white',
        title: "Hen egg white lysozyme",
        description: <>
          The lysozyme is represented as molecular surfarce. The tetramethyl lysine (DM0) and dimethyl lysine (MLY) molecules are highlighted as balls and sticks.
          Water molecules are represented as balls. The fluorescent effect is obtained by using a combination of lighting settings: Specular, Diffuse, Ambient Occlusion.
          These are available from the <strong>View - Scene settings</strong> menu.
          <br />
          PDB code: <a href="https://www.rcsb.org/structure/132L">132L</a>.
          <br />
          <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-2.png",
        sessionUrl: "/gallery/2",
        originalWidth: 4096,
        originalHeight: 2116,
        onClickWidth: 419,
        onClickHeight: 220, //211
        tryItButtonTextColour: 'white',
        title: "Chikungunya virus replication complex",
        description: <>
          The model is represented as spheres coloured by atoms.
          The cavities are highlighted using <strong>Ambient occlusion</strong> which can be enabled in the <strong>View - Scene settings</strong> menu.
          <br />
          PDB code: <a href="https://www.rcsb.org/structure/7Y38">7Y38</a>.
          <br />
          <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-3.png",
        sessionUrl: "/gallery/3",
        originalWidth: 4096,
        originalHeight: 2283,
        onClickWidth: 409,
        onClickHeight: 228,
        tryItButtonTextColour: 'grey',
        title: "NEAT domain from Staphylococcus aureus in complex with heme",
        description: <>
          The model is shown as a molecular surface, with the map masked around the HEME and depicted as a wireframe.
          The HEME is represented as balls and sticks. The shiny effect is achieved by adjusting the lighting settings, combining Ambient, Specular, and Diffuse options.
          These are available from the <strong>View - Scene settings</strong> menu.
         PDB code: <a href="https://www.rcsb.org/structure/2Z6F">2Z6F</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-4.png",
        sessionUrl: "/gallery/4",
        originalWidth: 4096,
        originalHeight:2264,
        onClickWidth: 409,
        onClickHeight: 226,
        tryItButtonTextColour: 'grey',
        title: "Human serotonin 5-HT3A receptor in complex with vortioxetine",
        description: <>
         The 5-HT3A receptor pentamer subunits are shown as ribbons, with the vortioxetine ligands represented as spheres.
         NAG molecules are represented as glyco-blocks.
         PDB code: <a href="https://www.rcsb.org/structure/8BLA">8BLA</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-5.png",
        sessionUrl: "/gallery/5",
        originalWidth: 5096,
        originalHeight: 3264,
        onClickWidth: 409,
        onClickHeight: 226,
        tryItButtonTextColour: 'grey',
        title: "Zebrafish IRF-10 DBD complex with DNA",
        description: <>
         The DNA molecule is shown as ribbons, with the bases represented as disks and the phosphate groups as balls and sticks.
         The protein is represented as ribbons. The side chains of residues in interaction with DNA are represented as balls and sticks.
         PDB code: <a href="https://www.rcsb.org/structure/8HCL">8HCL</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-6.png",
        sessionUrl: "/gallery/6",
        originalWidth: 536,
        originalHeight: 449,
        onClickWidth: 260,  //306
        onClickHeight: 230, //249
        tryItButtonTextColour: 'grey',
        title: "Bordetella pertussis virulence factor P.69 pertactin",
        description: <>
         The beta-helix structure is represented as ribbons, with one strand highlighted in gold.
         The background color is teal and can be adjusted in the <strong>View - Scene Settings</strong> menu.
         <br />
         PDB code: <a href="https://www.rcsb.org/structure/1DAB">1DAB</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-7.png",
        sessionUrl: "/gallery/7",
        originalWidth: 2728,
        originalHeight: 2509,
        onClickWidth: 234,
        onClickHeight: 220,
        tryItButtonTextColour: 'grey',
        title: "Outer membrane (OM) protein CymA from Klebsiella oxytoca",
        description: <>
         The model is represented as ribbons, the C8E molecules are depicted as ball and sticks.
         The perspective projection can be enabled in the <strong>View - Other settings</strong> menu.
         <br />
         PDB code: <a href="https://www.rcsb.org/structure/4V3H">4V3H</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-8.png",
        sessionUrl: "/gallery/8",
        originalWidth: 4096,
        originalHeight: 2959,
        onClickWidth: 290, //309
        onClickHeight: 215, //225
        tryItButtonTextColour: 'grey',
        title: "Cyclin-dependent kinase",
        description: <>
         The kinase is represented as spheres coloured by atoms.
         The cartoon effect is obtained by using <strong>Edge detection</strong> available from the <strong>View - Scene settings</strong> menu.
         <br />
         PDB code: <a href="https://www.rcsb.org/structure/2VTQ">2VTQ</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-9.png",
        sessionUrl: "/gallery/9",
        originalWidth: 2062, //2092
        originalHeight: 1848,//2178
        onClickWidth: 245,
        onClickHeight: 220,
        tryItButtonTextColour: 'grey',
        title: "PTH-bound human PTH1R in complex with Gs (class2)",
        description: <>
         cryo-EM model and map of PTH-PTH1R-Gs.
         The map is masked by chains, with each map displayed as a semi-transparent surface.
         The model is represented as ribbons.
         <br />
         PDB code: <a href="https://www.rcsb.org/structure/7VVL">7VVL</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-10.png",
        sessionUrl: "/gallery/10",
        originalWidth: 4096,
        originalHeight: 2482,
        onClickWidth: 280,
        onClickHeight: 207,
        tryItButtonTextColour: 'grey',
        title: "Scorpion protein toxin",
        description: <>
         High resolution X-ray structure of a scorpion protein toxin.
         The map is depicted as a wireframe, with another map inside shown as a surface to illustrate the atomic positions. 
         The model is displayed as balls and sticks, with alternate conformations distinguished by different colors.
         PDB code: <a href="https://www.rcsb.org/structure/1AHO">1AHO</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-11.png",
        sessionUrl: "/gallery/11",
        originalWidth: 4096, 
        originalHeight: 2630,
        onClickWidth: 359,
        onClickHeight: 205,
        tryItButtonTextColour: 'white',
        title: "Nicotinic acetylcholine receptor 1 subunit bound to alpha-bungarotoxin",
        description: <>
         The model is displayed as balls and sticks and the map is depicted as a wireframe.
         NAG and MAN molecules are represented as glyco-blocks.
         PDB code: <a href="https://www.rcsb.org/structure/2QC1">2QC1</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
      {
        src: "https://raw.githubusercontent.com/moorhen-coot/gallery-sessions/main/images/gallery-12.png",
        sessionUrl: "/gallery/12",
        originalWidth: 4096,
        originalHeight: 2300,
        onClickWidth: 370,
        onClickHeight: 210,
        tryItButtonTextColour: 'white',
        title: "Cyclin-dependent kinase inhibitor",
        description: <>
         The LZA ligand is displayed as balls and sticks and the map is depicted as a transparent surface.
         The fluorescent effect is obtained by using a combination of lighting settings
         available from the <strong>View - Scene settings</strong> menu.
         PDB code: <a href="https://www.rcsb.org/structure/2VTQ">2VTQ</a>.
         <br />
         <strong>Click on the play button to load the Moorhen session!</strong>
        </>
      },
    ];

    let reorderedimageData = [
      imageData[5],
      imageData[1],
      imageData[6],
      imageData[2],
      imageData[7],
      imageData[4],
      imageData[8],
      imageData[3],
      imageData[9],
      imageData[11],
      imageData[10],
      imageData[12],
    ];

    const photos = reorderedimageData.map(image => ({
      src: image.src,
      width: image.originalWidth,
      height: image.originalHeight
    }));

    const handleSessionLoad = useCallback(() => {
        window.location.href = reorderedimageData[imageIndex].sessionUrl as string
    }, [imageIndex, reorderedimageData]);

    const handleFigureClick = (currentIndex: number) => {
      setImageIndex(currentIndex)
      setShowModal(true)
    }
    return <div style={{
            width: '100wh',
            //margin: '0 auto',
            paddingLeft: '60px', // change the space around the grid
            paddingRight: '60px',
            boxSizing: 'border-box',
            //background: 'linear-gradient(to right, #ff6b6b, #556270)'
            //background: '#556270'
            }}>
          <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginBottom: '60px',
                     marginTop: '60px'
                    }}>

            <div style={{ flex: 1}}>
              <Typography
                variant="h5"
                style={{
                       fontFamily: 'TT_Chocolates_demibold, cursive',
                       fontSize: '90px',
                       textAlign: 'center',
                       }}>
               Moorhen Gallery
              </Typography>
              <Typography
                variant="body1"
                style={{
                      fontFamily: 'Inconsolata, cursive',
                      textAlign: 'center',
                      paddingRight: '30px',
                      fontSize: '25px'}}>
                <> Screenshots created with <a href="https://moorhen.org">moorhen.org</a> </>
              </Typography>
            </div>
          </div>

          <div style={{width: '100%' , overflowX: 'hidden', overflowY: 'auto'}}>
            <PhotoAlbum
              layout= "masonry"
              photos= {photos}
              columns={4}
              spacing={1}
              onClick={({ index }) => handleFigureClick(index)}
            />
          </div>
          <Modal open={showModal}
           onClose={() => setShowModal(false)}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
           style={{color: 'black', backdropFilter: "blur(5px)"}}
          >
          <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50wh',
              bgcolor: 'background.paper',
              border: '1px solid #000',
              borderRadius: '1rem',
              boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
              p: 4
          }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontFamily: 'Lato', textAlign: 'center', fontSize: '25px'}}>
            {reorderedimageData[imageIndex].title}
          </Typography>
            <div style={{display: 'flex', justifyContent: 'center', paddingTop :'20px' }}>
              <img src={reorderedimageData[imageIndex].src}
               style={{width: reorderedimageData[imageIndex].onClickWidth*2, height: reorderedimageData[imageIndex].onClickHeight*2}}/>
              <IconButton onClick={handleSessionLoad}
                style={{
                  position: 'absolute',
                  top: 460,
                  bottom:150,
                  left: 50,
                  width: reorderedimageData[imageIndex].onClickWidth/5,
                  height: reorderedimageData[imageIndex].onClickHeight/5,
                  color: reorderedimageData[imageIndex].tryItButtonTextColour,
              }}>
                <PlayCircleOutlined style={{width: '70px', height: '70px'}}/>
              </IconButton>
            </div>
            <Typography id="modal-modal-description"
                        sx={{ mt: 2 }}
                        style={{fontFamily: 'Avenir', marginLeft: '20px', fontSize: '18px'}}>
              {reorderedimageData[imageIndex].description}
            </Typography>
          </Box>
          </Modal>
        </div>
}
