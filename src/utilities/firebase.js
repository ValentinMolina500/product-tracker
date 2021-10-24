import app from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}
class Firebase {
    constructor() {
      app.initializeApp(config)
      this.db = app.database()
      console.log('Firebase init!');
    }

    addNewProduct = (locationReference, barcodeNumber) => {
        return this.db.ref(`/${locationReference}/${barcodeNumber}`).set({
            active: true
        })
    }

    getItemsForLocation = (locationReference) => {
        console.log(`/${locationReference}`);
        return this.db.ref(`/${locationReference}`).once('value');
    }

    getItemDetails = (barcode) => {
        return this.db.ref(`/items/${barcode}`).once('value');
    }
}
const firebase = new Firebase()

export default firebase