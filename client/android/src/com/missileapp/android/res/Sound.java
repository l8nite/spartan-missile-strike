package com.missileapp.android.res;

public class Sound {
    private String soundID;
    private boolean foreground;
    private boolean loop;
    
    /**
     * Sound ID to play
     * @param soundID - Sound to Play
     * @param foreground - true if foreground
     * @param loop - true to loop
     */
    public Sound(String soundID, boolean foreground, boolean loop) {
        super();
        this.soundID = soundID;
        this.foreground = foreground;
        this.loop = loop;
    }
    
    
    /**
     * Play the sound
     */
    public void play() {
        
    }
    
    /**
     * Pause the sound
     */
    public void pause() {
        
        
    }
    
    /**
     * Stop the sound
     */
    public void stop() {
        
    }
}