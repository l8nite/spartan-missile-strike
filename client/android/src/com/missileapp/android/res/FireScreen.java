package com.missileapp.android.res;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

import android.graphics.Color;
import android.hardware.Camera;
import android.util.Log;
import android.widget.Toast;

public class FireScreen {
    // DATA
    private static final String TAG = "FireScreen";                 // TAG for logging
    private static final int CAMERA_ORIENTATION = 90;               // Camera orientation -> portrait
    private BagOfHolding variables;                                 // Variable bag
    private Camera cam;                                             // Camera
    
    
    /**
     * FireScreen constructoer
     * @param variables - MissileApp Application 
     */
    public FireScreen(BagOfHolding variables) {
        this.variables = variables;
    }
    
    /**
     * Enters the firesceen
     *  Requests the reat-facing  {@link Camera}
     *  Sets the draw screen
     *  Starts the Preview (in Portrat)
     */
    public void enterFireScreen() {
        MALogger.log(TAG, Log.INFO, "Roll Cam.");
        try {
            // Create and Save Variables, default to rear facing camera
            cam = Camera.open();
            if(cam != null) {
                // Color Transparent
                variables.getWebView().setBackgroundColor(Color.TRANSPARENT);
                
                // Set Orientation and display  
                cam.setDisplayOrientation(CAMERA_ORIENTATION);
                cam.setPreviewDisplay(variables.getSurfaceHolder());
                
                // Lock and Start Preview
                cam.lock();
                cam.startPreview();
                
                variables.getSurfaceHolder().setKeepScreenOn(true);
            }
            else {
                MALogger.log(TAG, Log.WARN, "No Camera.");
                Toast.makeText(variables.getMissileApp(), "No Camera", Toast.LENGTH_SHORT).show();
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Error Starting Camera", e);
        }
    }
    
    
    /**
     * Exits the FireScreen
     *  Stop and Release the {@link Camera} 
     */
    public void exitFireScreen() {
        MALogger.log(TAG, Log.INFO, "Stop Cam.");
        try {
            // Stop Preview, unlock, and release
            if(cam != null) {
                // Color Transparent
                variables.getWebView().setBackgroundColor(Color.MAGENTA);
                //TODO REMOVE, update main.xml layout file
                //variables.getWebView().setBackgroundColor(Color.BLACK);
                
                // Process stop request
            	variables.getSurfaceHolder().setKeepScreenOn(false);
                cam.stopPreview();
                cam.unlock();
                cam.release();
            }
            else {
                MALogger.log(TAG, Log.WARN, "Camera is null.");
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Stopping Camera failed.", e);
        }
        finally {
            cam = null;
        }
    }

    
    /**
     * Release cam temporarily if it's in firescreen
     */
    public void processPauseRequest() {
        MALogger.log(TAG, Log.INFO, "Release Cam Method.");
        if(cam != null) {
            try {
                MALogger.log(TAG, Log.INFO, "Releasing Cam.");
                cam.stopPreview();
                cam.unlock();
            }
            catch (Exception e) {
                MALogger.log(TAG, Log.ERROR, "Error Releasing Camera!", e);
            }
        }
    }

    
    /**
     * Reopen camera if it was in firescreen
     */
    public void processResumeRequest() {
        MALogger.log(TAG, Log.INFO, "Reopening Cam Method.");
        if(cam != null) {
            try {
                MALogger.log(TAG, Log.INFO, "Reopening Cam.");
                cam.lock();
                cam.startPreview();
            }
            catch (Exception e) {
                MALogger.log(TAG, Log.ERROR, "Error Restarting Camera!", e);
            }
        }
    }
}