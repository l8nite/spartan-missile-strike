//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>

//supporting the native funtions
//no UI view
// UIwebview delegate for SSNAtive bridge to contain everything
@interface SSNativeBridge : NSObject <UIApplicationDelegate>
{
    /**
     creating a json parser that makes ther equest from the API
     */

    UIWindow* window;
    NSMutableData* responseData;
    
}
@property(nonatomic,retain) IBOutlet UIWindow* window;
 




@end
