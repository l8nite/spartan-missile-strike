package com.missileapp.android.res;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;

import org.json.JSONObject;

import android.media.MediaPlayer;
import android.util.Log;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;
import com.missileapp.android.R;

public class MediaManager {
    // Sounds
    public static final int FX_BACKGROUND_MUSIC = R.raw.background_music;
    public static final int FX_EXPLOSION = R.raw.explosion;
    public static final int FX_CAMERA_FOCUSED = R.raw.camera_focused;
    public static final int FX_MISSILE_LAUNCHED = R.raw.missile_launched;
    public static final int FX_PAGE_TRANSITION = R.raw.page_transition;
    public static final int FX_TURRET_MOVING = R.raw.turret_moving;
    
    // Native Bridge Identifier
    public static final String FX_BACKGROUND_MUSIC_NBIDENT = "background_music";
    public static final String FX_EXPLOSION_NBIDENT = "explosion";
    public static final String FX_CAMERA_FOCUSED_NBIDENT = "camera_focused";
    public static final String FX_MISSILE_LAUNCHED_NBIDENT = "missile_launched";
    public static final String FX_PAGE_TRANSITION_NBIDENT = "page_transition";
    public static final String FX_TURRET_MOVING_NBIDENT = "turrent_moving";
    
    // Static Definition Values
    private static final float DEFAULT_SPEAKER_VOLUME = 1.0f;             // Default Speaker Volume

    // Application data 
    private static final String TAG = "MediaManager";
    private BagOfHolding variables;                 // Variables
    private HashMap<String, MediaPlayer> sounds;    // Sound Manager
    private LinkedList<PlayRequest> playSoundsList; // Sounds to be played when loaded 
    private float foregroundVolume;                 // foreground volume
    private float backgroundVolume;                 // background volume
    
    
    public MediaManager(BagOfHolding variables) {
        this.variables = variables;
        sounds = new HashMap<String, MediaPlayer>();
        playSoundsList = new LinkedList<PlayRequest>();
        
        // Get Volume Data
        foregroundVolume = variables.getSettings().getFloat("foreVolume", DEFAULT_SPEAKER_VOLUME);
        backgroundVolume = variables.getSettings().getFloat("backVolume", DEFAULT_SPEAKER_VOLUME);
    }

    public void loadSound() {
        Runnable loadAllSounds = new Runnable() {
            @Override
            public void run() {
                // Background Music
                MediaPlayer mp_background_music = MediaPlayer.create(variables.getMissileApp(), FX_BACKGROUND_MUSIC);
                mp_background_music.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_BACKGROUND_MUSIC_NBIDENT) == null) {
                            sounds.put(FX_BACKGROUND_MUSIC_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_background_music.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_BACKGROUND_MUSIC_NBIDENT);
                        mp.prepareAsync();
                    }
                });
                
                // SFX - Explosion
                MediaPlayer mp_explosion = MediaPlayer.create(variables.getMissileApp(), FX_EXPLOSION);
                mp_explosion.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_EXPLOSION_NBIDENT) == null) {
                            sounds.put(FX_EXPLOSION_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_explosion.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_EXPLOSION_NBIDENT);
                        mp.prepareAsync();
                    }
                });
                
                // SFX - Camera Focused
                MediaPlayer mp_camera_focused = MediaPlayer.create(variables.getMissileApp(), FX_CAMERA_FOCUSED);
                mp_camera_focused.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_EXPLOSION_NBIDENT) == null) {
                            sounds.put(FX_CAMERA_FOCUSED_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_camera_focused.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_CAMERA_FOCUSED_NBIDENT);
                        mp.prepareAsync();
                    }
                });
                
                // SFX - Missile Launched
                MediaPlayer mp_missile_launched = MediaPlayer.create(variables.getMissileApp(), FX_MISSILE_LAUNCHED);
                mp_missile_launched.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_EXPLOSION_NBIDENT) == null) {
                            sounds.put(FX_MISSILE_LAUNCHED_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_missile_launched.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_MISSILE_LAUNCHED_NBIDENT);
                        mp.prepareAsync();
                    }
                });
                
                // SFX - Page Transition
                MediaPlayer mp_page_transition = MediaPlayer.create(variables.getMissileApp(), FX_PAGE_TRANSITION);
                mp_page_transition.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_EXPLOSION_NBIDENT) == null) {
                            sounds.put(FX_PAGE_TRANSITION_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_page_transition.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_PAGE_TRANSITION_NBIDENT);
                        mp.prepareAsync();
                    }
                });
                
                // SFX - Turret Moving
                MediaPlayer mp_turret_moving = MediaPlayer.create(variables.getMissileApp(), FX_TURRET_MOVING);
                mp_turret_moving.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    public void onPrepared(MediaPlayer mp) {
                        if(sounds.get(FX_EXPLOSION_NBIDENT) == null) {
                            sounds.put(FX_TURRET_MOVING_NBIDENT, mp);
                        }
                        processRequests();
                    }
                });
                mp_turret_moving.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    public void onCompletion(MediaPlayer mp) {
                        mp.reset();
                        sounds.remove(FX_TURRET_MOVING_NBIDENT);
                        mp.prepareAsync();
                    }
                });
            }
        };
        loadAllSounds.run();
    }

    /**
     * If app is sent to pause/stop request
     */
    public void processPause() {
        //TODO Process Pause
    }
    
    /**
     * Resume sound when Resuming
     */
    public void processResume() {
        //TODO Process Resume
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
            
            MediaPlayer mp = sounds.get(soundID);
            if(mp != null) {
                float volume = foregroundVolume;
                boolean loop = false;
                JSONObject playOptions = new JSONObject((options == null || options.trim().equalsIgnoreCase("undefined")) ? "{}" : options);

                // Foreground Volume
                try {    volume = (playOptions.getBoolean("foreground")) ? foregroundVolume : backgroundVolume;
                } catch (Exception e) { }

                // Loop?
                try {    loop = playOptions.getBoolean("loop");
                } catch (Exception e) {}
                
                mp.setVolume(volume, volume);
                mp.setLooping(loop);
                mp.start();
                MALogger.log(TAG, Log.INFO, "Sound (" + soundID + ") started.");
            }
            else {
                MALogger.log(TAG, Log.WARN, "Sound not yet ready, adding to queue");
                
                PlayRequest newRequest = new PlayRequest();
                newRequest.soundID = soundID;
                newRequest.jsonPlayOptions = options;
                playSoundsList.addLast(newRequest);
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not play audio options", e);
        }
    }
    
    /**
     * Stop a specific sound
     * @param soundID - the audio to stop
     */
    public void stopSound(String soundID) {
        MALogger.log(TAG, Log.INFO, "Stopping sound: " + soundID);
        MediaPlayer mp = sounds.get(soundID);
        if(mp != null && mp.isPlaying()) {
            mp.pause();
        }
        else {
            MALogger.log(TAG, Log.WARN, "Sound (" + soundID + ") does not exist or is not playing.");
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
        
        //TODO
        // Update all foreground music
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
        
        //TODO
        // Update all foreground music
    }
    
    
    private void processRequests() {
        Iterator<PlayRequest> iterator = playSoundsList.iterator();
        while (iterator.hasNext()) {
            PlayRequest request = iterator.next();
            if(sounds.get(request.soundID) != null) {
                iterator.remove();
                playSound(request.soundID, request.jsonPlayOptions);
            }
        }
    }
    
    private class PlayRequest {
        private String soundID;
        private String jsonPlayOptions;
    }
}
