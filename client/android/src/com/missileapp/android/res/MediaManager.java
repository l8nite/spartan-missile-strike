package com.missileapp.android.res;

import com.missileapp.android.BagOfHolding;

public class MediaManager {
    private BagOfHolding variables;

    /**
     * Media Manager to Play/Mute/Stop Audio 
     * @param variables
     */
    public MediaManager(BagOfHolding variables) {
        this.variables = variables;
    }
    
    
    /**
     * Play a sound with the provided options
     * @param JSONoptions - the audio options:
     *          soundID - sound to play
     *          foreground - true if fore, else background
     *          loop - ture to loop the audio
     */
    public void playSound(String JSONoptions) {
        
    }
    
    /**
     * If app is sent to pause/stop request
     */
    public void processPauseRequest() {
        
    }
    
    /**
     * Resume sound when Resuming
     */
    public void processResumeRequest() {
        
    }
    
    
    /**
     * Stop a specific sound
     * @param soundID - the audio to stop
     */
    public void stopSound(String soundID) {
        
    }
    
    
}
