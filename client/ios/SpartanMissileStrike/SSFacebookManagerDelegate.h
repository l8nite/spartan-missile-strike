//
//  SSFacebookManagerDelegate.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSFacebookManagerDelegate <NSObject>
-(void)facebookUserDidLogIn;
-(void)facebookUserDidLogOut;
@end
