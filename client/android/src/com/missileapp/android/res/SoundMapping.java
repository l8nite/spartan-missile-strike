package com.missileapp.android.res;

import com.missileapp.android.R;

public class SoundMapping {

	/**
	 * Returns the Native Bridge sound id map to the raw identifier
	 * @param id - Native Bridge ID
	 * @return R.raw.* sound file id
	 */
	public static int getSoundMappingfromID(String id) {
		if(id.equalsIgnoreCase("background_music")){
			return R.raw.background_music;
		}
		else if(id.equalsIgnoreCase("explosion")){
			return R.raw.background_music;
		}
		else if(id.equalsIgnoreCase("camera_focused")){
			return R.raw.background_music;
		}
		else if(id.equalsIgnoreCase("missile_launched")){
			return R.raw.background_music;
		}
		else if(id.equalsIgnoreCase("page_transition")){
			return R.raw.background_music;
		}
		else if(id.equalsIgnoreCase("turret_moving")){
			return R.raw.background_music;
		}
		else {
			return -1;
		}
	}
}

















//package com.missileapp.android.res;
//
//import java.io.IOException;
//
//import com.missileapp.android.MALogger;
//
//import android.content.Context;
//import android.media.MediaPlayer;
//import android.util.Log;
//
//public class SoundMapping {
//    private static final String TAG = "SOUND";
//    private String soundID;
//    private boolean foreground;
//    private boolean loop;
//    
//    private MediaPlayer player;
//    
//    /**
//     * Sound ID to play
//     * @param soundID - Sound to Play
//     * @param foreground - true if foreground
//     * @param loop - true to loop
//     */
//    public SoundMapping(Context context, String soundID, boolean foreground, boolean loop) {
//        super();
//        this.soundID = soundID;
//        this.foreground = foreground;
//        this.loop = loop;
//        
//        //TODO Edit Set file (change '0') or else it will crash!!!
//        player = MediaPlayer.create(context, 0);
//        
//        // Set looping
//        player.setLooping(true);
//            
//        // Listener to prep audio when done
//        player.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
//            
//            @Override
//            public void onCompletion(MediaPlayer mp) {
//                prepare();
//            }
//        });
//        
//        prepare();
//    }
//    
//    private void prepare() {
//        try {
//            player.prepare();
//        }
//        catch (IllegalStateException e) {
//            MALogger.log(TAG, Log.ERROR, "Illegal State Error:" + e.getMessage(), e);
//        }
//        catch (IOException e) {
//            MALogger.log(TAG, Log.ERROR, "IOError:" + e.getMessage(), e);
//        }
//    }
//    
//    /**
//     * Play the sound
//     */
//    public void play() {
//        player.start();
//    }
//    
//    /**
//     * Pause the sound
//     */
//    public void pause() {
//        player.pause();
//    }
//    
//    /**
//     * Stop the sound
//     */
//    public void stop() {
//        player.stop();
//        prepare();
//    }
//
//    
//    
//    // TODO NOTE: can't set loop of already created class
//    
//    /**
//     * Returns this audio sound
//     * @return sound id
//     */
//    public String getSoundID() {
//        return soundID;
//    }
//
//    /**
//     * Returns foreground state
//     * @return true if foreground music, else false
//     */
//    public boolean isForeground() {
//        return foreground;
//    }
//
//    /**
//     * Returns where this audio is looping
//     * @return true if looping, else false
//     */
//    public boolean isLooping() {
//        return loop;
//    }
//}