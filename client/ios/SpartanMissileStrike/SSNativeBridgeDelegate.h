//
//  SSNativeBridgeDelegate.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSNativeBridgeDelegate <NSObject>

-(BOOL)nativeBridgeFunction:(NSString *)function withArguments:(NSDictionary *)arguments;

@end