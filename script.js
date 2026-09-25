let port = null;
let reader = null;
let writer = null;

let currentLimit = 29.0;


// ------------------------------------
// CONNECT ESP32
// ------------------------------------

document
    .getElementById("connectButton")
    .addEventListener("click", connectESP32);


async function connectESP32() {

    try {

        // Ask browser for serial port
        port = await navigator.serial.requestPort();

        // Open ESP32 serial connection
        await port.open({
            baudRate: 115200
        });

        updateConnection(true);

        // Create writer
        writer = port.writable.getWriter();

        // Start reading ESP32 data
        readSerial();

    } catch (error) {

        console.error(error);

        alert("Could not connect to ESP32.");
    }
}


// ------------------------------------
// READ SERIAL DATA
// ------------------------------------

async function readSerial() {

    const decoder = new TextDecoder();

    reader = port.readable.getReader();

    let buffer = "";

    try {

        while (true) {

            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value);

            const lines = buffer.split("\n");

            buffer = lines.pop();

            for (const line of lines) {

                processESP32Data(line.trim());
            }
        }

    } catch (error) {

        console.error(error);

    } finally {

        reader.releaseLock();
    }
}


// ------------------------------------
// PROCESS ESP32 DATA
// ------------------------------------

function processESP32Data(data) {

    console.log("ESP32:", data);

    /*
       Example:

       TEMP:28.5,LIMIT:29.0,STATUS:NORMAL
    */

    if (data.startsWith("TEMP:")) {

        const parts = data.split(",");

        let temperature = null;
        let limit = null;
        let status = null;

        for (const part of parts) {

            if (part.startsWith("TEMP:")) {

                temperature =
                    parseFloat(
                        part.substring(5)
                    );
            }

            if (part.startsWith("LIMIT:")) {

                limit =
                    parseFloat(
                        part.substring(6)
                    );
            }

            if (part.startsWith("STATUS:")) {

                status =
                    part.substring(7);
            }
        }

        if (temperature !== null) {

            updateTemperature(temperature);
        }

        if (limit !== null) {

            currentLimit = limit;

            document.getElementById(
                "limitStatus"
            ).textContent =
                "Current limit: " +
                limit +
                "°C";
        }

        if (status === "ALARM") {

            showAlarm();

        } else if (status === "NORMAL") {

            showNormal();
        }
    }

    if (data.startsWith("LIMIT_SET:")) {

        const limit =
            parseFloat(
                data.substring(10)
            );

        if (!isNaN(limit)) {

            currentLimit = limit;

            document.getElementById(
                "limitStatus"
            ).textContent =
                "Current limit: " +
                limit +
                "°C";
        }
    }
}


// ------------------------------------
// UPDATE TEMPERATURE
// ------------------------------------

function updateTemperature(value) {

    document.getElementById(
        "temperature"
    ).textContent =
        value.toFixed(1);
}


// ------------------------------------
// SHOW NORMAL
// ------------------------------------

function showNormal() {

    const card =
        document.getElementById("statusCard");

    card.className = "status normal";

    document.getElementById(
        "statusIcon"
    ).textContent = "🟢";

    document.getElementById(
        "statusTitle"
    ).textContent = "NORMAL";

    document.getElementById(
        "statusMessage"
    ).textContent =
        "Temperature is normal";

    document.getElementById(
        "buzzerStatus"
    ).textContent = "OFF";
}


// ------------------------------------
// SHOW ALARM
// ------------------------------------

function showAlarm() {

    const card =
        document.getElementById("statusCard");

    card.className = "status alarm";

    document.getElementById(
        "statusIcon"
    ).textContent = "🔴";

    document.getElementById(
        "statusTitle"
    ).textContent = "TEMPERATURE ALERT!";

    document.getElementById(
        "statusMessage"
    ).textContent =
        "Temperature exceeded the limit!";

    document.getElementById(
        "buzzerStatus"
    ).textContent = "ON";
}


// ------------------------------------
// SET TEMPERATURE LIMIT
// ------------------------------------

document
    .getElementById("setLimitButton")
    .addEventListener("click", setTemperatureLimit);


async function setTemperatureLimit() {

    const input =
        document.getElementById(
            "limitInput"
        );

    const limit =
        parseFloat(input.value);

    if (isNaN(limit)) {

        alert("Please enter a valid temperature.");

        return;
    }

    currentLimit = limit;

    document.getElementById(
        "limitStatus"
    ).textContent =
        "Sending limit: " +
        limit +
        "°C";

    // Send command to ESP32
    if (writer) {

        const command =
            "LIMIT:" +
            limit +
            "\n";

        const encoder =
            new TextEncoder();

        await writer.write(
            encoder.encode(command)
        );

        console.log(
            "Sent:",
            command
        );

    } else {

        alert(
            "Please connect the ESP32 first."
        );
    }
}


// ------------------------------------
// CONNECTION STATUS
// ------------------------------------

function updateConnection(connected) {

    const dot =
        document.getElementById(
            "connectionDot"
        );

    const text =
        document.getElementById(
            "connectionText"
        );

    if (connected) {

        dot.style.background =
            "#22c55e";

        text.textContent =
            "ESP32 Connected";

    } else {

        dot.style.background =
            "#888";

        text.textContent =
            "Not Connected";
    }
}