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
@interface UserInfo : NSObject{
    
}

//Using singleton
@property (nonatomic, retain)NSString *userid;
@property (nonatomic, retain)NSString *firstname;
@property (nonatomic, retain)NSString *lastname;
@property (nonatomic, retain)NSString *username;
@property (nonatomic, retain)NSObject *link;
@property (nonatomic, retain)NSString *gender;
@property (nonatomic, retain)NSMutableArray *friendslist;
@property (nonatomic, retain)NSObject *locale;
 

 