import './App.css';
import { Button, Grid, GridItem, Heading} from '@chakra-ui/react';

function App() {
  return (
    <div className="App">
        <Grid height="100vh" width="100vw" gridTemplateRows="auto 1fr auto">

            {/* Row 1 */}
           <GridItem>
                <Heading>Product Tracker</Heading>
           </GridItem>

            {/* Row 2 */}
            <GridItem bg="pink">
               
            </GridItem>
            
             {/* Row 3 */}
            <GridItem>
                <Button>Scan Product</Button>
            </GridItem>
        </Grid>
    </div>
  );
}

export default App;
