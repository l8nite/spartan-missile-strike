//
//  SSOverlay.m
//  SpartanMissileStrike
//
//  Created by Sherif on 3/7/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSOverlay.h"

@implementation SSOverlay

- (id)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        //clear the background color of the overlay
        self.opaque = NO;
        self.backgroundColor = [UIColor clearColor];
		
        //load an image to show in the overlay
        UIImage *crosshair = [UIImage imageNamed:@"crosshair.png"];
        UIImageView *crosshairView = [[UIImageView alloc]
                                      initWithImage:crosshair];
        crosshairView.frame = CGRectMake(0, 40, 320, 300);
		crosshairView.contentMode = UIViewContentModeCenter;
        [self addSubview:crosshairView];
        ///[crosshairView release];
		
        //add a simple button to the overview
        //with no functionality at the moment
        UIButton *button = [UIButton
                            buttonWithType:UIButtonTypeRoundedRect];
        [button setTitle:@"Catch now" forState:UIControlStateNormal];
        button.frame = CGRectMake(0, 430, 320, 40);
        [self addSubview:button];
    }
    return self;
}



@end
