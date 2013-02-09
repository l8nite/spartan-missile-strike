package com.missileapp.android;

import java.util.Date;

import android.util.Log;

import com.missileapp.android.BuildConfig;

public class MSLogger {
	public static void log(String tag, int LogType, String msg, Throwable tr) {
		msg = (msg != null) ? (new Date() +  ": " + msg) : (new Date() +  ": No Msg!") ; 
		if(BuildConfig.DEBUG) {
			switch (LogType) {
				case Log.DEBUG:
					if(tr != null)
						Log.d(tag, msg, tr);
					else
						Log.d(tag, msg);
					break;
					
				case Log.ERROR:
					if(tr != null)
						Log.e(tag, msg, tr);
					else
						Log.e(tag, msg);
					break;
					
				case Log.INFO:
					if(tr != null)
						Log.i(tag, msg, tr);
					else
						Log.i(tag, msg);
					break;
				
				case Log.VERBOSE:
					if(tr != null)
						Log.v(tag, msg, tr);
					else
						Log.v(tag, msg);
					break;
				
				case Log.WARN:
					if(tr != null)
						Log.w(tag, msg, tr);
					else
						Log.w(tag, msg);
					break;
	
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
