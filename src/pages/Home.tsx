import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react"
import { useEffect, useState } from "react"
import { BarcodeScanner } from "@capacitor-community/barcode-scanner"
import { scanOutline, stopCircleOutline } from "ionicons/icons"
import "./Home.css"

const Home: React.FC = () => {
  const [err, setErr] = useState<string>()

  const [hideBg, setHideBg] = useState(false)

  const [present] = useIonAlert()

  const startScan = async () => {
    BarcodeScanner.hideBackground()
    setHideBg(true)
    // make background of WebView transparent

    const result = await BarcodeScanner.startScan() // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      stopScan()
      present({
        message: result.content,
        buttons: [
          "Cancel",
          { text: "Ok", handler: (d) => console.log("ok pressed") },
        ],
        onDidDismiss: (e) => console.log("did dismiss"),
      })
      console.log(result.content) // log the raw scanned content
    }
  }

  const stopScan = () => {
    BarcodeScanner.showBackground()
    setHideBg(false)
    BarcodeScanner.stopScan()
  }

  useEffect(() => {
    const checkPermission = async () => {
      setErr(undefined);
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });

        if (status.granted) {
          return true;
        }

        return false;
      } catch (error: any) {
        // Use 'any' type for now, but ideally, you should replace it with the actual type of the error object
        console.error(error);
        setErr(error.message);
      }
    }


    checkPermission()

    return () => {}
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QRScanner</IonTitle>
          {hideBg && (
            <IonButtons slot="end">
              <IonButton onClick={stopScan} color="danger">
                <IonIcon icon={stopCircleOutline} slot="start" />
                Stop Scan
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className={hideBg ? "hideBg" : "ion-padding"}>
        {err && (
          <IonRow>
            {" "}
            <IonText color="danger">{err}</IonText>
          </IonRow>
        )}

        {!!!err && hideBg && <div className="scan-box"></div>}
        {!!!err && !!!hideBg && (
          <IonButton className="center-button" onClick={startScan}>
            <IonIcon icon={scanOutline} slot="start" />
            Start Scan
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home