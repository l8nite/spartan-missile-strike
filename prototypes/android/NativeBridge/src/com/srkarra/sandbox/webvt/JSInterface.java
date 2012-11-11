package com.srkarra.sandbox.webvt;


import android.content.*;
import android.webkit.*;
import android.widget.*;

public class JSInterface {
	Context context;
	WebView webview;
	byte[] data;
	
	JSInterface(Context cont, WebView view) {
		context = cont;
		webview = view;
	}
	
	public void smsDoIt() {
		Toast.makeText(context, "Native Code-Peekaboo!", Toast.LENGTH_SHORT).show();
//		webview.loadUrl("file:///android_asset/main/stuff.html");
//		for (int i = 0; i < 1000; i++) {}
		webview.loadUrl("javascript:testAll('Text from Native App')");
		
//		webview.loadUrl("javascript:(justdoit() { " +
//				"makedoitStuff('One','Two');" +
//				"})()");
//		Toast.makeText(context, "Called!", Toast.LENGTH_SHORT).show();
	}
	
	public void toastThemVars(String text) {
		Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
	}
}
