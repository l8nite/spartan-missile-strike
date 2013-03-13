//
//  SSPreferenceManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SSPreferenceManager : NSObject

@property (nonatomic, strong) NSUserDefaults *userDefaults;

-(void)setPreferences:(NSDictionary*)preferences withCompletionHandler:(void (^)(BOOL success))completionHandler;
-(void)getPreferences:(NSArray*)preferences withCompletionHandler:(void (^)(NSDictionary* preferences))completionHandler;

@end
