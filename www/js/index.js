var app = {
    messageToWrite: [],     

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    onDeviceReady: function() {
        app.clear();

        nfc.addTagDiscoveredListener (
            app.onNfc, //tag successfully scanned
            function(status) {
                app.makeMessage();
                app.display("Tap NFC tag to write data");
            }, 

            function(error) {
                app.display("NFC reader failed to initialize " + JSON.stringify(error));
            }  
        )
    },

    onNfc: function(nfcEvent) {
        app.writeTag(app.messageToWrite);
    },

    display: function(message) {
        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);
        messageDiv.appendChild(label);    
    },
    
    clear: function() {
        messageDiv.innerHTML = "";
    },
    
    makeMessage: function() {
        var tnf = ndef.TNF_WELL_KNOWN,
            recordType = ndef.RTD_URI,
            payload = nfc.stringToBytes("kc.kobotoolbox.org/mbaldassaro/forms/new_form/instance/412191"),
            record,
            message = [];
            
            record = ndef.record(tnf, recordType, [], payload);
            payload.unshift(0x03);
            message.push(record);
            app.messageToWrite = message;
    },    

    writeTag: function(message) {
        //write record to tag
        nfc.write(
            message,
            function() {
                app.display("Wrote data to tag");
            },
            function(reason) {
                alert("There was a problem " + reason);
            }
        );
    }
};
  
