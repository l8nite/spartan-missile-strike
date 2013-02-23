package com.missileapp.android;

import java.util.Date;
import android.util.Log;
import com.missileapp.android.BuildConfig;

public class MALogger {
    /**
     * Overloaded Constructor, see {@link MALogger#log(String, int, String, Throwable)}
     */
    public static void log(String TAG, int LogType, String msg) {
        log(TAG, LogType, msg, null);
    }
    
	/**
	 * Logging function, See {@link Log}
	 * @param TAG - Class that needs to log 
	 * @param LogType - Type of Log, Look at {@link Log#ASSERT}}
	 * @param msg - Message to print. Date and Time is automatically added {@link Date#toString()}
	 * @param tr - Throwable to print {@link Throwable}
	 */
	public static void log(String TAG, int LogType, String msg, Throwable tr) {
		// Add Timestamp to msg
		msg = (msg != null) ? (new Date() +  ": " + msg) : (new Date() +  ": No Msg!");
		
		// Log only in debug mode
		if(BuildConfig.DEBUG) {
			switch (LogType) {
				//DEBUG
				case Log.DEBUG:
					if(tr != null)
						Log.d(TAG, msg, tr);
					else
						Log.d(TAG, msg);
					break;
				
				//ERROR
				case Log.ERROR:
					if(tr != null)
						Log.e(TAG, msg, tr);
					else
						Log.e(TAG, msg);
					break;
				
				//Info
				case Log.INFO:
					if(tr != null)
						Log.i(TAG, msg, tr);
					else
						Log.i(TAG, msg);
					break;
				
				//VERBOSE
				case Log.VERBOSE:
					if(tr != null)
						Log.v(TAG, msg, tr);
					else
						Log.v(TAG, msg);
					break;
				
				//WARN
				case Log.WARN:
					if(tr != null)
						Log.w(TAG, msg, tr);
					else
						Log.w(TAG, msg);
					break;
	
				//WTF Happened?! See Log.wtf()
				default:
					if(tr != null)
						Log.wtf(TAG, msg, tr);
					else
						Log.wtf(TAG, msg);
					break;
			}
		}
	}
}
