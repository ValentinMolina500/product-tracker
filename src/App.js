import './App.css';
import { Button, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useEffect, useState } from 'react';
import MapContainer from './MapContainer';

import firebase from './utilities/firebase';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(data);
    }, [data]);

    const [showScanner, setShowScanner] = useState(false);

    return (
        <div className="App">
            <Grid height="100vh" width="100vw" gridTemplateRows="auto 1fr auto">

                {/* Row 1 */}
                <GridItem>
                    <Heading>Product Tracker</Heading>
                    <Text>{data}</Text>
                </GridItem>

                {/* Row 2 */}
                <MapContainer apiKey={process.env.REACT_APP_GOOGLE_MAP_API} />

                {/* Row 3 */}
                <GridItem>
                    {showScanner && <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={(err, result) => {
                            if (result) setData(result.text)
                        }}
                    />}

                    <Button onClick={() => setShowScanner(!showScanner)}>Scan Product</Button>
                </GridItem>
            </Grid>
        </div>
    );
}

export default App;
