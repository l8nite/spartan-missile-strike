package com.missileapp.android;

import java.io.IOException;

import android.hardware.Camera;
import android.os.Bundle;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.app.Activity;

public class MissileApp extends Activity implements SurfaceHolder.Callback{
	//TODO create log functions
	
	//Variables
	private Camera cam;
	private SurfaceView surfaceView;
	private SurfaceHolder surfaceHolder;
	private WebView webview;
	
	
	/*********************************
	 * Android call back functions
	 *********************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
    }
    
    @Override
    protected void onResume() {
    	// TODO Auto-generated method stub
    	super.onResume();
    }
    
    @Override
    protected void onPause() {
    	// TODO Auto-generated method stub
    	super.onPause();
    }
    
    @Override
    protected void onStop() {
    	// TODO Auto-generated method stub
    	super.onStop();
    }
    
    /********************************
     * Camera access functions 
     ********************************/
    
    /**
     * Locks the front facing camera
     */
    public void openCam(SurfaceHolder holder) {
    	//TODO Exception Handling
    	if(cam != null) {
    		cam = Camera.open();
    	}
    	if(holder != null) {
    		try {
				cam.setPreviewDisplay(holder);
    		}
			catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    }
    
    /**
     * Roll Camera
     */
    public void startCam() {
    	if(cam != null) {
    		cam.startPreview();
    	}
    }
    
    /**
     * Close the camera and set it to null
     */
    public void closeCam() {
    	try {
    		if(cam != null ) {
	        	cam.stopPreview();
	        	cam.release();
	        	cam = null;
    		}
		} catch (Exception e) {
			// TODO: handle exception
		}
    	
    }
    
    
    /*********************************
	 * Surface call back function
	 *********************************/
	@Override
	/**
	 * Surface holder is created and we can reserve the camera nad 
	 */
	public void surfaceCreated(SurfaceHolder holder) {
		try {
			if(cam == null) {
				this.openCam(holder);
			}
		}
		catch (Exception e) {
			// TODO: handle exception
		}
		
	}
	
	@Override
	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
		try {
			if (cam == null)
				this.openCam(holder);
		}
		catch (Exception e) {
			// TODO: handle exception
		}
	}

	@Override
	public void surfaceDestroyed(SurfaceHolder holder) {
		// TODO exception handling
		this.closeCam();
	}
	

}
