//
//  SSPreferenceManager.h
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import <UIKit/UIKit.h>

//singletin
// set preference and get preference 

@interface SSPreferenceManager :NSObject
{

NSUserDefaults *userDefault;

}

//instance methods

-(void)setPreference:(NSString *) value forKey:(NSString *) key;
-(NSString *)preferenceForKey: (NSString *)key;
@end
 