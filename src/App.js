import './App.css';
import {
    Button, Grid, GridItem, Heading, Text, Flex, Box, Image, Badge, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useEffect, useState } from 'react';
import MapContainer from './MapContainer';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useParams
} from "react-router-dom";
import places from './utilities/places';
import firebase from './utilities/firebase';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react"

import charmin from './charmin.jpg';

function Home({ nearbyLocations, setNearbyLocations, currSelectedPos, setCurrPhoto, setCurrSelectedPos, currPhoto }) {
    const history = useHistory();

    const [data, setData] = useState(null);
    const [defaultPos, setDefaultPos] = useState({});


    const [currentPosition, setCurrentPosition] = useState({});
    const success = position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);

        console.log('setting currentPosition');
        onLocationSet(currentPosition);
        setDefaultPos(currentPosition);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success);

    }, [])

    const [showScanner, setShowScanner] = useState(false);

    const onLocationSet = ({ lat, lng }) => {
        places.getNearbyLocations(lat, lng)
            .then((data) => {
                return data.json();
            }).then(r => {
                console.log(r);
                setNearbyLocations(r.results)
            })
            .catch(err => {
                console.log('places err: ' + err)
            })
    }

    const renderNearbyLocations = () => {
        return nearbyLocations.map((res, index) => {
            return (
                <Box onClick={() => history.push(`/${index}`)} onMouseEnter={() => setCurrentPosition(res.geometry.location)} borderBottom="1px solid #ccc" p="1rem" _hover={{ background: "gray.100", cursor: "pointer" }}>
                    <Text textAlign="left" fontSize="1rem">{res.name}</Text>
                    <Text textAlign="left" fontSize="0.875rem" color="gray.700">{res.vicinity}</Text>
                </Box>
            );
        })
    }


    return (
        <>
            <Grid height="100vh" width="100vw" gridTemplateRows="auto 1fr auto" gridTemplateColumns="350px 1fr">

                {/* Row 1 */}
                <GridItem gridColumn="1/3" p="1rem" boxShadow="md">
                    <Heading textAlign="left">Product Tracker</Heading>
                    <Text>{data}</Text>
                </GridItem>

                {/* Row 2 */}
                <GridItem gridColumn="1" overflow="auto">
                    <Grid gridTemplateRows="auto 1fr" >
                        <Heading size="1rem" textAlign="left" p="1rem">Nearby Locations</Heading>
                        <GridItem>
                            <Box>
                                {renderNearbyLocations()}
                            </Box>
                        </GridItem>
                    </Grid>
                </GridItem>
                <MapContainer
                    currentPosition={currentPosition}
                    nearbyLocations={nearbyLocations}
                    gridColumn="2"
                    onLocationSet={onLocationSet}
                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
                />

                {/* Row 3 */}
                <GridItem gridColumn="1/3" p="1rem" d="flex" justifyContent="start" bg="gray.100">
                    {showScanner && <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={(err, result) => {
                            if (result) setData(result.text)
                        }}

                    />}
                    <Button colorScheme="purple" onClick={() => setShowScanner(!showScanner)}>Scan Product</Button>
                    <Button ml="2rem" colorScheme="purple" onClick={() => setCurrentPosition(defaultPos)}>Reset View</Button>

                </GridItem>
            </Grid>

        </>
    );
}

function ItemView(props) {
    return (
        <Box w="100vw" minH="100vh" bg="gray.100">
            <Box w="1200px" mx="auto" d="block" py="4rem" px="2rem" bg="white" >
                <Grid gridTemplateRows="300px 1fr" gridTemplateColumns="1fr" gridRowGap="1rem">
                    <GridItem gridRow="1" bg="blue">
                        <Image src={charmin} objectFit="cover" h="300px" w="1200px" />
                    </GridItem>
                    <GridItem>
                        <Heading>Charmin Ultra Soft Toilet Paper Mega Rolls, 12 ct</Heading>
                        <Text fontSize="1.25rem" mb="1rem" color="gray.700"></Text>
                        <Box>
                            <Table variant="simple">
                                <TableCaption>Item Availability Updates</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Available</Th>
                                        <Th>Time Updated</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td><Badge colorScheme="green">Available</Badge></Td>
                                        <Td>9:38 AM</Td>
                                    </Tr>
                                    <Tr>
                                    <Td>
                                        <Badge colorScheme="green">Available</Badge></Td>
                                        <Td>8:27 AM</Td>
                                    </Tr>
                                    <Tr>
                                        <Td><Badge colorScheme="red">Not Available</Badge></Td>
                                        <Td>8:00 AM</Td>
                                    </Tr>
                                </Tbody>
                                
                            </Table>
                        </Box>

                    </GridItem>
                </Grid>
            </Box>


        </Box>
    );
}

function Location(props) {
    const { nearbyLocations } = props;
    const { locId } = useParams();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currPhoto, setCurrPhoto] = useState(null);
    const [itemsForLocation, setItemsForLocation] = useState([]);
    useEffect(() => {
        const currPos = nearbyLocations[locId];

        if (!currPos) return;

        places.getPhoto(currPos.photos[0].photo_reference)
            .then((img) => { console.log(img); setCurrPhoto(img.url) });

        firebase.getItemsForLocation(currPos.reference)
            .then(async (items) => {
                // setItemsForLocation(Object.keys(items).map(key => {}))
                const data = items.val();
                if (!data) return;

                const promises = Object.keys(data).map(key => firebase.getItemDetails(key));

                const results = await Promise.all(promises);

                const dataResults = results.map(d => d.val());



                const final = Object.keys(data).map((key, index) => {
                    return { ...data[key], ...dataResults[index] }
                });

                console.log('this is final', final);

                setItemsForLocation(final);

            })
    }, [nearbyLocations, locId]);

    const currPos = nearbyLocations[locId];

    const onScanSuccess = async (barcode) => {

        try {
            await firebase.addNewProduct(currPos.reference, barcode);

        } catch (err) {
            alert(err);
        }

        onClose();
    }

    // const itemsForLocation = [
    //     {
    //         itemName: "Quaker Chewy Granola Bar",
    //         itemPicture: "https://cdn.shopify.com/s/files/1/0996/7396/products/0003000056408_L_1700x.jpg?v=1593534019",
    //         available: true
    //     },
    //     {
    //         itemName: "Lotus Biscoff Cookies",
    //         itemPicture: "https://www.shopbiscoff.com/media/catalog/product/cache/84f78a7ba97df0f84c7c77f3441056aa/l/b/lb1550629.png",
    //         available: true
    //     }
    // ];

    const renderItemsForLocations = () => {
        return itemsForLocation.map((item) => {
            return (
                <Grid onClick={() => history.push('/3/3')} w="100%" gridTemplateColumns="auto 1fr auto auto" p="1rem" columnGap="1rem" alignItems="center" _hover={{ bg: "gray.100", cursor: "pointer" }}>
                    <Image src={item.picture} w="40px" objectFit="cover" />
                    <Text>{item.itemName}</Text>
                    <Text>Last updated 12:23PM</Text>
                    <Badge colorScheme="green">Available</Badge>
                </Grid>
            );
        });
    }
    return (
        <Box w="100vw" minH="100vh" bg="gray.100">
            <Box w="1200px" mx="auto" d="block" py="4rem" px="2rem" bg="white" >
                <Grid gridTemplateRows="300px 1fr" gridTemplateColumns="1fr" gridRowGap="1rem">
                    <GridItem gridRow="1" bg="blue">
                        <Image src={currPhoto} objectFit="cover" h="300px" w="1200px" />
                    </GridItem>
                    <GridItem>
                        <Heading>{currPos.name}</Heading>
                        <Text fontSize="1.25rem" mb="1rem" color="gray.700">{currPos.vicinity}</Text>
                        <Box>
                            {renderItemsForLocations()}
                        </Box>

                        <Button onClick={onOpen} mt="1rem" colorScheme="purple">Add Product</Button>
                    </GridItem>
                </Grid>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Scan a product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <BarcodeScannerComponent
                            width={500}
                            height={500}
                            onUpdate={(err, result) => {
                                console.log(result);
                                if (result) {
                                    onScanSuccess(result);
                                }
                            }}

                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="purple" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

function App() {
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [currSelectedPos, setCurrSelectedPos] = useState(null);
    const [currPhoto, setCurrPhoto] = useState(null);

    return (
        <Router>
            <Switch>
                <Route path="/:locId/:itemId">
                    <ItemView />
                </Route>
                <Route path="/:locId">
                    <Location nearbyLocations={nearbyLocations} />
                </Route>
                <Route path="/">
                    <Home nearbyLocations={nearbyLocations} setNearbyLocations={setNearbyLocations} currSelectedPos={currSelectedPos} setCurrSelectedPos={setCurrSelectedPos} currPhoto={currPhoto} setCurrPhoto={setCurrPhoto} />
                </Route>
            </Switch>
        </Router>

    );
}

export default App;
