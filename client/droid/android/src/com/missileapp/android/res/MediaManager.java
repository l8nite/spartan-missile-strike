package com.missileapp.android.res;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map.Entry;

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
    private HashMap<String, Boolean> foregroundMap; // ForegroundMap to track what's in the foreground
    private ArrayList<String> playingSounds;        // Track sounds that are currently playing before pausing
    private float foregroundVolume;                 // foreground volume
    private float backgroundVolume;                 // background volume
    
    
    public MediaManager(BagOfHolding variables) {
        this.variables = variables;
        sounds = new HashMap<String, MediaPlayer>();
        playSoundsList = new LinkedList<PlayRequest>();
        foregroundMap = new HashMap<String, Boolean>();
        
        // Get Volume Data
        foregroundVolume = backgroundVolume = DEFAULT_SPEAKER_VOLUME;
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
                sounds.put(FX_BACKGROUND_MUSIC_NBIDENT, mp_background_music);
                
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
                sounds.put(FX_EXPLOSION_NBIDENT, mp_explosion);
                
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
                sounds.put(FX_CAMERA_FOCUSED_NBIDENT, mp_camera_focused);
                
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
                sounds.put(FX_MISSILE_LAUNCHED_NBIDENT, mp_missile_launched);
                
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
                sounds.put(FX_PAGE_TRANSITION_NBIDENT, mp_page_transition);
                
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
                sounds.put(FX_TURRET_MOVING_NBIDENT, mp_turret_moving);
            }
        };
        loadAllSounds.run();
    }

    /**
     * If app is sent to pause/stop request
     */
    public void processPause() {
        playingSounds = new ArrayList<String>();
        
        for (Entry<String, MediaPlayer> entry : sounds.entrySet()) {
            String key = entry.getKey();
            MediaPlayer mp = entry.getValue();
            if(mp != null && mp.isPlaying()) {
                try {
                    mp.pause();
                    playingSounds.add(key);
                } catch (Exception e) {  }
            }
        }
    }
    
    /**
     * Resume sound when Resuming
     */
    public void processResume() {
        if(playingSounds != null) {
            for (String playingSound : playingSounds) {
                MediaPlayer mp = sounds.get(playingSound);
                try {
                    mp.start();
                } catch (Exception e) { }
            }
        }
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
            try {
                if(soundID.charAt(0) == '"') {
                   soundID = soundID.substring(1);
                }
            } catch(Exception ex) {}
            try {
                if(soundID.charAt(soundID.length() - 1) == '"') {
                   soundID = soundID.substring(0 , soundID.length() - 1);
                }
            } catch(Exception ex) {}
            
            
            MALogger.log(TAG, Log.INFO, "Play Sound:" + soundID + ". options: " + options + ".");
            
            MediaPlayer mp = sounds.get(soundID);
            if(mp != null) {
                float volume = foregroundVolume;
                boolean loop = false;
                JSONObject playOptions = new JSONObject((options == null || options.trim().equalsIgnoreCase("undefined")) ? "{}" : options);
                
                // Foreground Volume
                try {
                    boolean fore = playOptions.getBoolean("foreground");
                    foregroundMap.put(soundID, fore);
                    volume = (fore) ? foregroundVolume : backgroundVolume;
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
                playSoundsList.add(newRequest);
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
     * Play sound requests when audio is available
     */
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
