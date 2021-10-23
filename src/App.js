import './App.css';
import { Button, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(data);
    }, [data])
    return (
        <div className="App">
            <Grid height="100vh" width="100vw" gridTemplateRows="auto 1fr auto">

                {/* Row 1 */}
                <GridItem>
                    <Heading>Product Tracker</Heading>
                    <Text>{data}</Text>
                </GridItem>

                {/* Row 2 */}
                <GridItem bg="pink">

                </GridItem>

                {/* Row 3 */}
                <GridItem> 
                {!data &&  <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={(err, result) => {
                        if (result) setData(result.text)
                        else setData(null)
                    }}
                />}
               
                    <Button>Scan Product</Button>
                </GridItem>
            </Grid>
        </div>
    );
}

export default App;
