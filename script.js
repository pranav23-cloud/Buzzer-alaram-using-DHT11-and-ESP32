let port = null;

let reader = null;

let keepReading = false;


// Get HTML elements

const connectBtn =
    document.getElementById("connectBtn");

const disconnectBtn =
    document.getElementById("disconnectBtn");

const statusText =
    document.getElementById("statusText");

const statusDot =
    document.getElementById("statusDot");


// Change connection status

function setStatus(text, connected) {

    statusText.textContent = text;

    if (connected) {

        statusDot.style.background = "green";

    } else {

        statusDot.style.background = "red";

    }
}


// Display sensor data

function showData(data) {

    // Temperature

    if (data.temperature === null) {

        document.getElementById(
            "temperature"
        ).textContent = "--";

    } else {

        document.getElementById(
            "temperature"
        ).textContent =
            Number(data.temperature).toFixed(1);

    }


    // Humidity

    if (data.humidity === null) {

        document.getElementById(
            "humidity"
        ).textContent = "--";

    } else {

        document.getElementById(
            "humidity"
        ).textContent =
            Number(data.humidity).toFixed(1);

    }


    // Distance

    if (data.distance === null) {

        document.getElementById(
            "distance"
        ).textContent = "--";

    } else {

        document.getElementById(
            "distance"
        ).textContent =
            Number(data.distance).toFixed(1);

    }


    // Time

    document.getElementById(
        "lastUpdate"
    ).textContent =
        new Date().toLocaleTimeString();
}


// Connect ESP32

async function connectESP32() {

    // Check browser support

    if (!("serial" in navigator)) {

        alert(
            "Web Serial is not supported. " +
            "Use Google Chrome or Microsoft Edge."
        );

        return;
    }


    try {

        // Ask user to select COM port

        port =
            await navigator.serial.requestPort();


        // Open serial connection

        await port.open({
            baudRate: 115200
        });


        keepReading = true;


        connectBtn.disabled = true;

        disconnectBtn.disabled = false;


        setStatus(
            "ESP32 Connected",
            true
        );


        // Start reading

        readSerialData();

    }

    catch (error) {

        console.error(error);

        setStatus(
            "Connection failed",
            false
        );

    }

}


// Read ESP32 Serial data

async function readSerialData() {

    const decoder =
        new TextDecoderStream();


    const inputDone =
        port.readable.pipeTo(
            decoder.writable
        );


    reader =
        decoder.readable.getReader();


    let buffer = "";


    try {

        while (keepReading) {

            const {
                value,
                done
            } = await reader.read();


            if (done) {

                break;

            }


            if (!value) {

                continue;

            }


            buffer += value;


            const lines =
                buffer.split("\n");


            buffer =
                lines.pop();


            for (let line of lines) {

                line = line.trim();


                // Only process JSON

                if (!line.startsWith("{")) {

                    continue;

                }


                try {

                    const data =
                        JSON.parse(line);


                    if (
                        data.temperature !==
                        undefined
                    ) {

                        showData(data);

                    }

                }

                catch (error) {

                    console.log(
                        "Invalid JSON:",
                        line
                    );

                }

            }

        }

    }

    catch (error) {

        console.error(error);

    }

    finally {

        reader.releaseLock();

        await inputDone.catch(
            () => {}
        );

    }

}


// Disconnect ESP32

async function disconnectESP32() {

    keepReading = false;


    try {

        if (reader) {

            await reader.cancel();

        }


        if (port) {

            await port.close();

        }

    }

    catch (error) {

        console.error(error);

    }


    port = null;

    reader = null;


    connectBtn.disabled = false;

    disconnectBtn.disabled = true;


    setStatus(
        "Disconnected",
        false
    );

}


// Button actions

connectBtn.addEventListener(
    "click",
    connectESP32
);


disconnectBtn.addEventListener(
    "click",
    disconnectESP32
);


// Browser compatibility

if (!("serial" in navigator)) {

    setStatus(
        "Use Chrome or Edge",
        false
    );

}