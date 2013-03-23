package com.missileapp.android.res;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.missileapp.android.BagOfHolding;

//@SuppressWarnings("unused")
public class Gyro implements SensorEventListener{
    // DATA
    private static final String TAG = "Gyro";               // TAG for logging
    private BagOfHolding variables;                         // Variable bag
    private boolean isNativeBridgeSubscribed;               // true of native bridge is subscribed
    private String callbackID;                              // call back ident for native bridge
    private Sensor gyro;                                    // Gyro sensor implementation
    
    /**
     * Gyroscrope class for Native Bridge
     * @param variables {@link BagOfHolding} implementation
     */
    public Gyro(BagOfHolding variables) {
        this.variables = variables;
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public synchronized void startOrientationUpdates(String callbackID) {
        this.callbackID = callbackID;
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public synchronized void stopOrientationUpdates() {
        this.callbackID = null;
    }
    
    public synchronized void notifyNativeBridgeWithOrientation() {
        if(this.callbackID != null ) {
            String callbackData = "";
            variables.getDroidBridge().notifyNativeBridgeCallback(this.callbackID, callbackData);
        }
    }
    
    /** Accuracy changes */
    public void onAccuracyChanged(Sensor sensor, int accuracy) { }

    /** 
     * Sensor 
     */
    public void onSensorChanged(SensorEvent event) {
        
    }
}
