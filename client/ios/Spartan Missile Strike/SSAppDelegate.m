//
//  AppDelegate.m
//  Spartan Missile Strike
//
//  Created by Sherif on 11/28/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import "SSAppDelegate.h"

@implementation SSAppDelegate

//initialize an instance of the facebook and then call the alert view

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    // Override point for customization after application launch.
    self.window.backgroundColor = [UIColor colorWithRed:0.0 green:0.0 blue:0.6 alpha:1];
    [self.window makeKeyAndVisible];
    
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"success" message:@"is this a success" delegate:self cancelButtonTitle:@"yes" otherButtonTitles:@"no", nil];
    [alert show];

        return YES;
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if(buttonIndex==0)
    {
        //yes reroute to the other page
        NSLog(@"This is the yes button");
    }
    else if (buttonIndex==1)
    {
        //no i want to go there
        NSLog(@"This is the No button");
    }
    
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    NSLog(@"The game has been paused");
    
     [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(pauseGame:) name:UIApplicationWillResignActiveNotification object:nil];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    NSLog(@"The game came back");
    
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
