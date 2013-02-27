package com.missileapp.android.res;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.media.AudioManager;
import android.media.SoundPool;
import android.util.Log;
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
	private static final int MAX_FILES_PLAYED_SIMULTANEOUS =  6;           // MAX # of audio files playing at any given time TODO VERIFY THIS 
	private static final int SOURCE_QUALITY = 0;                           // QUALITY, currently unused, future android operation
	private static final int SOURCE_PRIORITY = 1;                          // Load Priority, currently unused, future android operation
	private static final float SPEAKER_VOLUME_LEFT = 1.0f;                 // Left speaker volume 100%
	private static final float SPEAKER_VOLUME_RIGHT = 1.0f;                // Right speaker volume 100%
	private static final float PLAY_RATE = 1.0f;                           // Play Rate - Normal
	private static final int DEFAULT_PRIORITY = 2;                         // Default Priority
	private static final int BACKGROUND_PRIORITY = 1;                      // Background Priority
	private static final int PLAYBACK_DEFAULT_VALUE = 0;                   // Default number of playback times - 1
	private static final int PLAYBACK_LOOP_VALUE = -1;                     // Value to loop
	
	// Application data 
    @SuppressWarnings("unused")
	private BagOfHolding variables;            // Variables
    private SoundPool soundPool;               // Sound Pool Manager
    private SparseIntArray soundMap;           // Maps raw identifer to sound pool identifier

    /**
     * Media Manager to Play/Mute/Stop Audio 
     * @param variables {@link BagOfHolding} data
     */
    public MediaManager(BagOfHolding variables) {
        this.variables = variables;
        soundMap = new SparseIntArray();
        soundPool = new SoundPool(MAX_FILES_PLAYED_SIMULTANEOUS, AudioManager.STREAM_MUSIC, SOURCE_QUALITY);
        
        // Load Files
        soundMap.put(FX_BACKGROUND_MUSIC, soundPool.load(variables.getMissileApp(), FX_BACKGROUND_MUSIC, SOURCE_PRIORITY));
        soundMap.put(FX_CAMERA_FOCUSED, soundPool.load(variables.getMissileApp(), FX_CAMERA_FOCUSED, SOURCE_PRIORITY));
        soundMap.put(FX_EXPLOSION, soundPool.load(variables.getMissileApp(), FX_EXPLOSION, SOURCE_PRIORITY));
        soundMap.put(FX_MISSILE_LAUNCHED, soundPool.load(variables.getMissileApp(), FX_MISSILE_LAUNCHED, SOURCE_PRIORITY));
        soundMap.put(FX_PAGE_TRANSITION, soundPool.load(variables.getMissileApp(), FX_PAGE_TRANSITION, SOURCE_PRIORITY));
        soundMap.put(FX_TURRET_MOVING, soundPool.load(variables.getMissileApp(), FX_TURRET_MOVING, SOURCE_PRIORITY));
    }
    
    
    /**
     * Returns the sound pool id given the native bridge id
     * @param nativeBridgeID the NativeBridgeID to retrieve
     * @return sound pool mapping stream id
     */
    public int getSoundPoolMappingFromRawID(String nativeBridgeID) {
		if(nativeBridgeID.equalsIgnoreCase("background_music")){
			return soundMap.get(FX_BACKGROUND_MUSIC);
		}
		else if(nativeBridgeID.equalsIgnoreCase("explosion")){
			return soundMap.get(FX_EXPLOSION);
		}
		else if(nativeBridgeID.equalsIgnoreCase("camera_focused")){
			return soundMap.get(FX_CAMERA_FOCUSED);
		}
		else if(nativeBridgeID.equalsIgnoreCase("missile_launched")){
			return soundMap.get(FX_MISSILE_LAUNCHED);
		}
		else if(nativeBridgeID.equalsIgnoreCase("page_transition")){
			return soundMap.get(FX_PAGE_TRANSITION);
		}
		else if(nativeBridgeID.equalsIgnoreCase("turret_moving")){
			return soundMap.get(FX_TURRET_MOVING);
		}
		else {
			return -1;
		}
	}

    
    /**
     * Play a sound with the provided options
     * @param options - the audio options:
     *            soundID - sound to play
     *            foreground - true if fore, else background
     *            loop - ture to loop the audio
     */
    public void playSound(String options) {
        try {
        	MALogger.log(TAG, Log.INFO, "Play Sound");
        	
        	// Parse options
			JSONObject playSound =  new JSONObject(options);
			int soundPoolID = getSoundPoolMappingFromRawID(playSound.getString("soundID"));
			boolean foreground = playSound.getBoolean("foreground");
			boolean loop = playSound.getBoolean("loop");
			
			// Play sound with options
			soundPool.play(soundPoolID, SPEAKER_VOLUME_LEFT, SPEAKER_VOLUME_RIGHT,
					(foreground) ? DEFAULT_PRIORITY : BACKGROUND_PRIORITY,
					(loop) ? PLAYBACK_LOOP_VALUE : PLAYBACK_DEFAULT_VALUE,
					PLAY_RATE);
		}
        catch (JSONException e) {
			MALogger.log(TAG, Log.ERROR, "Could not parse options" , e);
		}
        catch (Exception e) {
        	MALogger.log(TAG, Log.ERROR, "Could not play audio options" , e);
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
    		MALogger.log(TAG, Log.ERROR, "Could not pause data", e);
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
    		MALogger.log(TAG, Log.ERROR, "Could not resume data", e);
    	}
    }
    
    
    /**
     * Stop a specific sound
     * @param soundID - the audio to stop
     */
    public void stopSound(String soundID) {
    	try {
        	MALogger.log(TAG, Log.INFO, "Stop Sound");
        	
			int soundPoolID = getSoundPoolMappingFromRawID(soundID);
			
			// Play sound with options
			soundPool.stop(soundPoolID);
		}
        catch (Exception e) {
        	MALogger.log(TAG, Log.ERROR, "Could not play audio options" , e);
		}
    }
}
