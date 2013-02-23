package com.missileapp.android;

import com.missileapp.android.res.FireScreen;
import com.missileapp.android.res.MediaManager;
import com.missileapp.android.res.UserPreferences;

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
    
    // Primary Classes
    private MissileApp missileApp;             // MissileApp instance
    private AndroidBridge droidBridge;         // Android Interface to the WebView
    
    // Android Views
    private SurfaceView surfaceView;           // Surface View for layout options
    private SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
    private WebView webView;                   // WebView for UI
    private ImageView splashScreen;            // ImageView
    
    // Resource variables
    private SharedPreferences settings;        // System User Preferences
    private UserPreferences userPrefs;         // Droid Native Bridge user prefs implementation
    private FireScreen fireScreen;             // FireScreen, contains the camear framework
    private MediaManager mediaManager;         // Media Manager that keeps track of all files
    
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


    
    
    
    
    
    
    ///////////////////////////////////////////////
    //
    //          Primary Android Classes
    //
    ///////////////////////////////////////////////
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
    
    
    
    
    
    
    ///////////////////////////////////////////////
    //
    //              Android Views
    //
    ///////////////////////////////////////////////

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
    
    


    
    
    
    
    
    
    ///////////////////////////////////////////////
    //
    //      Android Native Bridge Resources
    //
    ///////////////////////////////////////////////


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
    
    /**
     * Instance of the User Perfences
     * @return {@link UserPreferences} instance
     */
    public UserPreferences getUserPrefs() {
        return userPrefs;
    }

    /**
     * Sets the user preference class
     * @param userPrefs new {@link UserPreferences} instance
     */
    public void setUserPrefs(UserPreferences userPrefs) {
        this.userPrefs = userPrefs;
    }


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

    /**
     * Returns the instance of the {@link MediaManager}
     * @return {@link MediaManager} instance
     */
    public MediaManager getMediaManager() {
        return mediaManager;
    }

    /**
     * Set the instance of the {@link MediaManager}
     * @param mediaManager the new instance of the {@link MediaManager}
     */
    public void setMediaManager(MediaManager mediaManager) {
        this.mediaManager = mediaManager;
    }

    
    
}
