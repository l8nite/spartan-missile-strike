package com.missileapp.android;

import android.app.Application;
import android.content.SharedPreferences;
import android.hardware.Camera;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.widget.ImageView;

/**
 * Bag of Holding - Holds the application data and variables
 */
@SuppressWarnings("unused")
public class BagOfHolding extends Application {
    private static BagOfHolding boh;
    
    // Variables
    private Camera cam;                        // Camera settings
    private SurfaceView surfaceView;           // Surface View for layout options
    private SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
    private WebView webView;                   // WebView for UI
    private ImageView splashScreen;            // ImageView
    private SharedPreferences settings;        // User Preferences
    
    
    /*********************************
     * Android OS call back functions
     *********************************/
    /**
     * Application created
     */
    @Override
    public void onCreate() {
        super.onCreate();
    }
    
    
    /**
     * Called when Android is low on memory
     */
    @Override
    public void onLowMemory() {
        super.onLowMemory();
        
    }
    
    
    /**
     * App is being closed.
     */
    @Override
    public void onTerminate() {
        super.onTerminate();
        
    }


    
    
    
    
    
    
    /*********************************
     *       Getters and Setters
     *********************************/
    /**
     * Returns this class.
     * @return this class holding all the variables
     */
    public static BagOfHolding getInstance() {
        return boh;
    }

    /**
     * Returns the Camera
     * @return Camera {@link Camera}
     */
    public Camera getCam() {
        return cam;
    }

    /**
     * Sets the Camera
     * @param cam - Camera to save 
     */
    public void setCam(Camera cam) {
        this.cam = cam;
    }

    /**
     * Returns the SurfaceView where the camera preview is drawn on
     * @return the SurfaceView
     */
    public SurfaceView getSurfaceView() {
        return surfaceView;
    }

    /**
     * Sets the SurfaceView where the camera preview is drawn on
     * @param surfaceView the SurfaceView to be drawn on
     */
    public void setSurfaceView(SurfaceView surfaceView) {
        this.surfaceView = surfaceView;
    }

    /**
     * Returns the SurfaceHolder, communication medium for camera and surface view
     * @return the SurfaceHolder
     */
    public SurfaceHolder getSurfaceHolder() {
        return surfaceHolder;
    }

    /**
     * Returns the SurfaceHolder, communication medium for camera and surface view
     * @param surfaceHolder, the medium between the camera and the surface
     */
    public void setSurfaceHolder(SurfaceHolder surfaceHolder) {
        this.surfaceHolder = surfaceHolder;
    }
    
    /**
     * Returns the SplashScreen ImageView
     * @return Returns the SplashScreen ImageView 
     */
    public ImageView getSplashScreen() {
        return splashScreen;
    }

    /**
     * Sets the SplashScreen ImageView
     * @param splashScreen
     */
    public void setSplashScreen(ImageView splashScreen) {
        this.splashScreen = splashScreen;
    }

    /**
     * Returns the WebView where core logic of the game is
     * @return the WebView
     */
    public WebView getWebView() {
        return webView;
    }

    /**
     * Sets the WebView
     * @param webView the new webview for game play
     */
    public void setWebView(WebView webView) {
        this.webView = webView;
    }

    /**
     * A User's preferences in terms of SharedPreferences
     * @return the user's preferences
     */
    public SharedPreferences getSettings() {
        return settings;
    }

    /**
     * Sets the User's Perferences
     * @param settings
     */
    public void setSettings(SharedPreferences settings) {
        this.settings = settings;
    }
}
