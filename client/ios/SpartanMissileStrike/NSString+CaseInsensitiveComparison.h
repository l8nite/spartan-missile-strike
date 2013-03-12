//
//  NSString+Equality.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (CaseInsensitiveComparison)

-(BOOL)isEqualIgnoringCase:(NSString *)string;

@end
