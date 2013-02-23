package com.missileapp.android.res;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

import android.hardware.Camera;
import android.util.Log;
import android.view.SurfaceHolder;
import android.widget.Toast;

public class FireScreen {
    // DATA
    private static final String TAG = "FireScreen";                        // TAG for logging
    private static final int CAMERA_ORIENTATION = 90;                      // Camera orientation -> portrait
    private static BagOfHolding varBag;                                    // Variable bag
    
    /**
     * FireScreen constructoer
     * @param varBag - MissileApp Application 
     */
    public FireScreen(BagOfHolding varBag) {
        FireScreen.varBag = varBag;
    }
    
    
    //TODO Enter FireScreen here
    public void rollCam() {
        MALogger.log(TAG, Log.INFO, "Roll Cam.");
        try {
            // Create and Save Variables, default to rear facing camera
            Camera cam = Camera.open();
            if(cam != null) {
                varBag.setCam(cam);
                SurfaceHolder holder = varBag.getSurfaceHolder();
                
                // Set Orientation and display  
                cam.setDisplayOrientation(CAMERA_ORIENTATION);
                cam.setPreviewDisplay(holder);
                
                // Lock and Start Preview
                cam.lock();
                cam.startPreview();
            }
            else {
                MALogger.log(TAG, Log.WARN, "No Camera.");
                Toast.makeText(varBag.getMissileApp(), "No Camera", Toast.LENGTH_SHORT).show();
            }
                
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Error Starting Camera", e);
        }
    }

    
    //TODO Exit FireScreen Here
    
    
    
    
    
    
    //TODO Process Pause Request
    
    
    //TODO Process Reume Request
    
    
    
}
