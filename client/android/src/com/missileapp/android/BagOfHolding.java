package com.missileapp.android;

import com.missileapp.android.res.FireScreen;

import android.app.Application;
import android.content.SharedPreferences;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.widget.ImageView;

/**
 * Bag of Holding - Holds the application data and variables
 */
public class BagOfHolding extends Application {
    private static BagOfHolding boh;
    
    // Variables
    private MissileApp missileApp;             // MissileApp instance
    private SurfaceView surfaceView;           // Surface View for layout options
    private SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
    private WebView webView;                   // WebView for UI
    private AndroidBridge droidBridge;         // Android Interface to the WebView
    private ImageView splashScreen;            // ImageView
    private SharedPreferences settings;        // User Preferences
    
    
    // Resource variables
    private FireScreen fireScreen;             // FireScreen, contains the camear framework
    
    /*********************************
     * Android OS call back functions
     *********************************/
    /**
     * Application created
     */
    @Override
    public void onCreate() {
        super.onCreate();
        BagOfHolding.boh = this;
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
     * Returns this class
     * @return this class holding all the variables
     */
    public static BagOfHolding getInstance() {
        return boh;
    }
    
    /**
     * Returns an instance of the {@link MissileApp}
     * @return the instance of the missile app
     */
    public MissileApp getMissileApp() {
        return missileApp;
    }

    /**
     * Sets the instance of {@link MissileApp}
     * @param missileApp the new instance of the missile app
     */
    public void setMissileApp(MissileApp missileApp) {
        this.missileApp = missileApp;
    }



    /**
     * Returns the {@link SurfaceView} where the camera preview is drawn on
     * @return the {@link SurfaceView} intance
     */
    public SurfaceView getSurfaceView() {
        return surfaceView;
    }

    /**
     * Sets the {@link SurfaceView} where the camera preview is drawn on
     * @param surfaceView the {@link SurfaceView} to be drawn on
     */
    public void setSurfaceView(SurfaceView surfaceView) {
        this.surfaceView = surfaceView;
    }

    /**
     * Returns the {@link SurfaceHolder}, communication medium for camera and surface view
     * @return the {@link SurfaceHolder} medium
     */
    public SurfaceHolder getSurfaceHolder() {
        return surfaceHolder;
    }

    /**
     * Returns the {@link SurfaceHolder}, communication medium for camera and surface view
     * @param surfaceHolder, the medium between the camera and the surface
     */
    public void setSurfaceHolder(SurfaceHolder surfaceHolder) {
        this.surfaceHolder = surfaceHolder;
    }
    
    /**
     * Returns the SplashScreen {@link ImageView}
     * @return Returns the SplashScreen {@link ImageView} 
     */
    public ImageView getSplashScreen() {
        return splashScreen;
    }

    /**
     * Sets the SplashScreen {@link ImageView}
     * @param splashScreen - the splashScreen {@link ImageView}
     */
    public void setSplashScreen(ImageView splashScreen) {
        this.splashScreen = splashScreen;
    }

    /**
     * Returns the {@link WebView} where core logic of the game is
     * @return the {@link WebView}
     */
    public WebView getWebView() {
        return webView;
    }

    /**
     * Sets the {@link WebView}
     * @param webView the new {@link WebView} for game play
     */
    public void setWebView(WebView webView) {
        this.webView = webView;
    }
    
    /**
     * Get {@link AndroidBridge} instance
     * @return instance of {@link AndroidBridge}
     */
    public AndroidBridge getDroidBridge() {
        return droidBridge;
    }

    /**
     * Sets an instance of {@link AndroidBridge}
     * @param droidBridge - the new instance of the {@link AndroidBridge}
     */
    public void setDroidBridge(AndroidBridge droidBridge) {
        this.droidBridge = droidBridge;
    }


    /**
     * A User's preferences in terms of {@link SharedPreferences}
     * @return the user's preferences
     */
    public SharedPreferences getSettings() {
        return settings;
    }

    /**
     * Sets the User's Perferences
     * @param settings {@link SharedPreferences} of the application
     */
    public void setSettings(SharedPreferences settings) {
        this.settings = settings;
    }

    
    
    
    
    
    
    ///////////////////////////////////////////////
    //
    //       Native Bridge Resources
    //
    ///////////////////////////////////////////////

    /**
     * Returns ths {@link FireScreen} insance 
     * @return the instance of the {@link FireScreen}
     */
    public FireScreen getFireScreen() {
        return fireScreen;
    }

    /**
     * Sets the instance of {@link FireScreen}
     * @param fireScreen the new instance of the {@link FireScreen}
     */
    public void setFireScreen(FireScreen fireScreen) {
        this.fireScreen = fireScreen;
    }

}
