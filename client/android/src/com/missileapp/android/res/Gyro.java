package com.missileapp.android.res;

import org.json.JSONException;
import org.json.JSONObject;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;
import android.widget.Toast;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class Gyro implements SensorEventListener {
    // DATA
    private static final String TAG = "Gyro";               // TAG for logging
    private static final float RADS_TO_DEGREES = 57.2957795f;
    private BagOfHolding variables;                         // Variable bag
    private String callbackID;                              // call back ident for native bridge
    
    // Sensor data
    private Sensor accelerometer;                           // accelerometer
    private Sensor magnetometer;                            // geomagenotometer
    private float[] gravity;                                // last known gravity sensor data
    private float[] magentic;                               // last known geomagentic sensor data
    private float azimuth;                                  // last known azimuth
    private float altitude;                                 // last known altitude
    
    /**
     * Gyroscrope class for Native Bridge
     * @param variables {@link BagOfHolding} implementation
     */
    public Gyro(BagOfHolding variables) {
        this.variables = variables;
        accelerometer = variables.getSensorManager().getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        magnetometer = variables.getSensorManager().getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public synchronized void startOrientationUpdates(String callbackID) {
        this.callbackID = callbackID;
        
        if(accelerometer == null || magnetometer == null) {
            Toast.makeText(variables.getMissileApp(), "Gyro unavailable or faulty", Toast.LENGTH_SHORT).show();
        }
        else {
            // Accelerometer
            if(accelerometer != null ) {
                variables.getSensorManager().registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_GAME);
            }
            
            // Magnetometer to calibrate
            if(magnetometer != null ) {
                variables.getSensorManager().registerListener(this, magnetometer, SensorManager.SENSOR_DELAY_GAME);
            }
        }
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public synchronized void stopOrientationUpdates() {
        this.callbackID = null;
        variables.getSensorManager().unregisterListener(this);
    }
    
    /**
     * Notify Native Bridge With Orientation
     */
    public synchronized void notifyNativeBridgeWithOrientation() {
        if(this.callbackID != null ) {
            JSONObject callbackData = new JSONObject();
            try {
                callbackData.put("azimuth", azimuth);
                callbackData.put("altitude", altitude);
            }
            catch (JSONException e) {
                MALogger.log(TAG, Log.ERROR, "Can't add orientation to json", e);
            }
            variables.getDroidBridge().notifyNativeBridgeCallback(this.callbackID, callbackData.toString());
        }
    }
    
    @Override
    public void onSensorChanged(SensorEvent event) {
        // Store new values
        switch (event.sensor.getType()) {
            case Sensor.TYPE_ACCELEROMETER:
                gravity = event.values;
                break;

            case Sensor.TYPE_MAGNETIC_FIELD:
                magentic = event.values;
                break;
            default:
                break;
        }
        
        if(gravity != null && magentic != null) {
            float[] R = new float[9];
            float[] I = new float[9];
            
            if(SensorManager.getRotationMatrix(R, I, gravity, magentic)) {
                float[] orientation = new float[3];
                SensorManager.getOrientation(R, orientation);
                
                azimuth = orientation[0] * RADS_TO_DEGREES;
                altitude = orientation[1] * RADS_TO_DEGREES;
            }
        }
    }
    
    // No idea what I'm supposed to do with this in regards to Missile App 
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) { }
}