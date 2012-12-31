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

@interface SSPreferenceManager
@end


//Jomana Sherif's Code for setting and getting preferences
@interface UserInfo : NSObject

//Using singleton
@property (nonatomic, retain)NSObject *userid;
@property (nonatomic, retain)NSObject *firstname;
@property (nonatomic, retain)NSObject *lastname;
@property (nonatomic, retain)NSObject *username;
@property (nonatomic, retain)NSObject *link;
@property (nonatomic, retain)NSObject *gender;
@property (nonatomic, retain)NSObject *friendslist;
@property (nonatomic, retain)NSObject *locale;

 