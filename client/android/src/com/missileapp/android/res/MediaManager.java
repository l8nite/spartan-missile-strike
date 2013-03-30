package com.missileapp.android.res;

import org.json.JSONException;
import org.json.JSONObject;

import android.media.AudioManager;
import android.media.SoundPool;
import android.util.Log;
import android.util.SparseBooleanArray;
import android.util.SparseIntArray;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;
import com.missileapp.android.R;

public class MediaManager {
	// NOTE: To add more music: add to sound variables, load file in constructor, update soundpool mapping funtion
	
	// Sound variables
	public static final int FX_BACKGROUND_MUSIC = R.raw.background_music;
	public static final int FX_EXPLOSION = R.raw.explosion;
	public static final int FX_CAMERA_FOCUSED = R.raw.camera_focused;
	public static final int FX_MISSILE_LAUNCHED = R.raw.missile_launched;
	public static final int FX_PAGE_TRANSITION = R.raw.page_transition;
	public static final int FX_TURRET_MOVING = R.raw.turret_moving;
	
	// Sound loading variables
	private static final String TAG = "MediaManager";
	private static final int MAX_FILES_PLAYED_SIMULTANEOUS =  10;          // MAX # of audio files playing at any given time 
	private static final int SOURCE_QUALITY = 0;                           // QUALITY, currently unused, future android operation
	private static final int SOURCE_PRIORITY = 1;                          // Priority, currently unused, future android operation
	private static final float DEFAULT_SPEAKER_VOLUME = 1.0f;              // Default Speaker Volume
	private static final float DEFAULT_PLAY_RATE = 1.0f;                   // Play Rate - Normal
	private static final int DEFAULT_PRIORITY = 2;                         // Default Priority
	private static final int BACKGROUND_PRIORITY = 1;                      // Background Priority
	private static final int PLAYBACK_DEFAULT_VALUE = 0;                   // Default number of playback times (minus 1)
	private static final int PLAYBACK_LOOP_VALUE = -1;                     // Value to loop
	
	// Application data 
    @SuppressWarnings("unused")
	private BagOfHolding variables;            // Variables
    private SoundPool soundPool;               // Sound Pool Manager
    private SparseIntArray soundMap;           // Maps raw identifer to sound pool identifier
    private SparseBooleanArray foregroundMap;  // Keeps track of what's in the foreground
    private float foregroundVolume;            // foreground volume
    private float backgroundVolume;            // background volume
    
    /**
     * Media Manager to Play/Mute/Stop Audio 
     * @param variables {@link BagOfHolding} data
     */
    public MediaManager(BagOfHolding variables) {
        this.variables = variables;
        soundMap = new SparseIntArray();
        foregroundMap = new SparseBooleanArray();
        soundPool = new SoundPool(MAX_FILES_PLAYED_SIMULTANEOUS, AudioManager.STREAM_MUSIC, SOURCE_QUALITY);
        
        // Get Volume Data
        foregroundVolume = variables.getSettings().getFloat("foreVolume", DEFAULT_SPEAKER_VOLUME);
        backgroundVolume = variables.getSettings().getFloat("backVolume", DEFAULT_SPEAKER_VOLUME);
        
        // Load Files
        soundMap.put(FX_BACKGROUND_MUSIC, soundPool.load(variables.getMissileApp(), FX_BACKGROUND_MUSIC, SOURCE_PRIORITY));
        soundMap.put(FX_CAMERA_FOCUSED, soundPool.load(variables.getMissileApp(), FX_CAMERA_FOCUSED, SOURCE_PRIORITY));
        soundMap.put(FX_EXPLOSION, soundPool.load(variables.getMissileApp(), FX_EXPLOSION, SOURCE_PRIORITY));
        soundMap.put(FX_MISSILE_LAUNCHED, soundPool.load(variables.getMissileApp(), FX_MISSILE_LAUNCHED, SOURCE_PRIORITY));
        soundMap.put(FX_PAGE_TRANSITION, soundPool.load(variables.getMissileApp(), FX_PAGE_TRANSITION, SOURCE_PRIORITY));
        soundMap.put(FX_TURRET_MOVING, soundPool.load(variables.getMissileApp(), FX_TURRET_MOVING, SOURCE_PRIORITY));
    }
    
    /**
     * Translates the native bridge sound id to android raw identifier
     * @param nativeBridgeID - native bridge identifier
     * @return Android music raw identifier
     */
    public int translateSoundIDToRawPointer(String nativeBridgeID) {
    	if(nativeBridgeID.equalsIgnoreCase("background_music"))
    	{	return FX_BACKGROUND_MUSIC;	 }
		else if(nativeBridgeID.equalsIgnoreCase("explosion"))
		{	return FX_EXPLOSION;	}
		else if(nativeBridgeID.equalsIgnoreCase("camera_focused"))
		{	return FX_CAMERA_FOCUSED; 	}
		else if(nativeBridgeID.equalsIgnoreCase("missile_launched"))
		{	return FX_MISSILE_LAUNCHED; 	}
		else if(nativeBridgeID.equalsIgnoreCase("page_transition"))
		{	return FX_PAGE_TRANSITION;	}
		else if(nativeBridgeID.equalsIgnoreCase("turret_moving"))
		{	return FX_TURRET_MOVING; 	}
		else
		{	return -1;	}
    }
    
    /**
     * Returns the sound pool id given the native bridge id
     * @param nativeBridgeID the NativeBridgeID to retrieve
     * @return sound pool mapping stream id
     */
    public int getSoundPoolMappingFromRawID(String nativeBridgeID) {
		return getSoundPoolMappingFromRawID(translateSoundIDToRawPointer(nativeBridgeID));
	}
    
    /**
     * Returns the sound pool id given the raw uri to the file
     * @param rawID the raw id/uri of the sound file
     * @return sound pool mapping stream id
     */
    public int getSoundPoolMappingFromRawID(int rawID) {
    	return soundMap.get(rawID);
    }
    
    /**
     * Play a sound with the provided options
     * @param soundID - sound to play
     * @param options - the audio options:
     *            foreground - true if fore, else background
     *            loop - ture to loop the audio
     */
    public void playSound(String soundID, String options) {
        try {
            MALogger.log(TAG, Log.INFO, "Play Sound:" + soundID + ". options: " + options + ".");

            // Create objects with defaults: foreground vol & priority, play once
            float volume = foregroundVolume;
            int priority = DEFAULT_PRIORITY;
            int loopTimes = PLAYBACK_DEFAULT_VALUE;
            int soundPoolID = getSoundPoolMappingFromRawID(soundID);
            JSONObject playOptions = new JSONObject((options == null || options.trim().equalsIgnoreCase("undefined")) ? "{}" : options);

            // Get foreground if it exists
            try {
                if (!playOptions.getBoolean("foreground")) {
                    volume = backgroundVolume;
                    priority = BACKGROUND_PRIORITY;
                }
            }
            catch (JSONException e) {
                MALogger.log(TAG, Log.ERROR, "Could not get foreground in JSON", e);
            }

            // Get loop if it exists
            try {
                if (playOptions.getBoolean("loop")) {
                    loopTimes = PLAYBACK_LOOP_VALUE;
                }
            }
            catch (JSONException e) {
                MALogger.log(TAG, Log.ERROR, "Could not get foreground in JSON", e);
            }

            // Play sound with options
            soundPool.play(soundPoolID, volume, volume, priority, loopTimes, DEFAULT_PLAY_RATE);
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not play audio options", e);
        }
    }
    
    /**
     * If app is sent to pause/stop request
     */
    public void processPauseRequest() {
    	try {
    		soundPool.autoPause();
    	}
    	catch (Exception e) {
    		MALogger.log(TAG, Log.ERROR, "Could not pause music.", e);
    	}
    }
    
    /**
     * Resume sound when Resuming
     */
    public void processResumeRequest() {
    	try {
    		soundPool.autoResume();
    	}
    	catch (Exception e) {
    		MALogger.log(TAG, Log.ERROR, "Could not resume music.", e);
    	}
    }
    
    /**
     * Stop a specific sound
     * @param soundID - the audio to stop
     */
    public void stopSound(String soundID) {
    	try {
        	MALogger.log(TAG, Log.INFO, "Stop Sound");
			
			// stop sound
        	int soundPoolID = getSoundPoolMappingFromRawID(soundID);
			soundPool.stop(soundPoolID);
		}
        catch (Exception e) {
        	MALogger.log(TAG, Log.ERROR, "Could not play audio options" , e);
		}
    }
    
    /**
     * Sets foreground volume and updates sound pool
     * @param newVolume the new volume
     */
    public void setForegroundVolume(String newVolume) {
    	MALogger.log(TAG, Log.INFO, "Setting Foreground: " + newVolume);
    	// Parse Volume
    	float volume = DEFAULT_SPEAKER_VOLUME;
    	try {
			volume = Float.parseFloat(newVolume);
		}
    	catch (Exception e) {
			MALogger.log(TAG, Log.ERROR, "Parse New Volume: " + e.getMessage() , e);
		}
    	
    	// Save Volume
    	foregroundVolume = volume;
    	
    	// Update all foreground music
    	try {
    		for (int i = 0; i < foregroundMap.size(); i++) {
        		if(foregroundMap.valueAt(i)) {
        			soundPool.setVolume(soundMap.get(foregroundMap.keyAt(i)), foregroundVolume, foregroundVolume);
        		}
    		}
		}
    	catch (Exception e) {
			MALogger.log(TAG, Log.ERROR, "Update all forevol: " + e.getMessage() , e);
		}
    }
    
    /**
     * Sets background volume and updates sound pool
     * @param newVolume the new volume
     */
    public void setBackgroundVolume(String newVolume) {
    	MALogger.log(TAG, Log.INFO, "Setting Foreground: " + newVolume);
    	// Parse Volume
    	float volume = DEFAULT_SPEAKER_VOLUME;
    	try {
			volume = Float.parseFloat(newVolume);
		}
    	catch (Exception e) {
			MALogger.log(TAG, Log.ERROR, "Parse New Volume: " + e.getMessage() , e);
		}
    	
    	// Save Volume
    	backgroundVolume = volume;
    	
    	// Update all foreground music
    	try {
	    	for (int i = 0; i < foregroundMap.size(); i++) {
	    		if(!foregroundMap.valueAt(i)) {
	    			soundPool.setVolume(soundMap.get(foregroundMap.keyAt(i)), backgroundVolume, backgroundVolume);
	    		}
			}
    	}
    	catch (Exception e) {
			MALogger.log(TAG, Log.ERROR, "Update all forevol: " + e.getMessage() , e);
		}
    }
}
