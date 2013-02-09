package com.missileapp.android;

import java.util.Date;
import android.util.Log;
import com.missileapp.android.BuildConfig;

public class MSLogger {
	/**
	 * Logging function, See {@link Log}
	 * @param tag - Class that needs to log 
	 * @param LogType - Type of Log, Look at {@link Log#ASSERT}}
	 * @param msg - Message to print. Date and Time is automatically added {@link Date#toString()}
	 * @param tr - Throwable to print {@link Throwable}
	 */
	public static void log(String tag, int LogType, String msg, Throwable tr) {
		// Add Timestamp to msg
		msg = (msg != null) ? (new Date() +  ": " + msg) : (new Date() +  ": No Msg!");
		
		// Log only in debug mode
		if(BuildConfig.DEBUG) {
			switch (LogType) {
				//DEBUG
				case Log.DEBUG:
					if(tr != null)
						Log.d(tag, msg, tr);
					else
						Log.d(tag, msg);
					break;
				
				//ERROR
				case Log.ERROR:
					if(tr != null)
						Log.e(tag, msg, tr);
					else
						Log.e(tag, msg);
					break;
				
				//Info
				case Log.INFO:
					if(tr != null)
						Log.i(tag, msg, tr);
					else
						Log.i(tag, msg);
					break;
				
				//VERBOSE
				case Log.VERBOSE:
					if(tr != null)
						Log.v(tag, msg, tr);
					else
						Log.v(tag, msg);
					break;
				
				//WARN
				case Log.WARN:
					if(tr != null)
						Log.w(tag, msg, tr);
					else
						Log.w(tag, msg);
					break;
	
				//WTF Happened?! See Log.wtf()
				default:
					if(tr != null)
						Log.wtf(tag, msg, tr);
					else
						Log.wtf(tag, msg);
					break;
			}
		}
	}
}
