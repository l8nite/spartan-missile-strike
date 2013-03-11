package com.missileapp.android.res;

import com.missileapp.android.BagOfHolding;

@SuppressWarnings("unused")
public class Gyro {
    // DATA
    private static final String TAG = "Gyro";               // TAG for logging
    private BagOfHolding variables;                         // Variable bag
    private boolean isNativeBridgeSubscribed;               // true of native bridge is subscribed
    private String callbackID;                              // call back ident for native brigde
    
    /**
     * Gyroscrope class for Native Bridge
     * @param variables {@link BagOfHolding} implementation
     */
    public Gyro(BagOfHolding variables) {
        this.variables = variables;
    }

    /**
     * Set location subscription to Native Bridge
     * @param activate true to send, else false
     * @param callbackID native bridge call back identifier
     */
    public void getOrientationUpdates(String activate, String callbackID) {
        try {
            isNativeBridgeSubscribed = Boolean.valueOf(activate);
            this.callbackID = callbackID;
        }
        catch (Exception e) {
            isNativeBridgeSubscribed = false;
        }
    }
}
