//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSAudioManager.h"
 
@interface SSNativeBridge : NSObject 
{
  
    SSAudioManager* sa1;

}
-(BOOL)dispatchNativeBridgeEventsFromURL:(NSURL*)url; 
-(void) loadHTMLContent;

@end
