//
//  NSString+Equality.m
//  SpartanMissileStrike
//
//  Created on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "NSString+CaseInsensitiveComparison.h"

@implementation NSString (CaseInsensitiveComparison)

-(BOOL)isEqualIgnoringCase:(NSString *)string
{
    return [self caseInsensitiveCompare:string] == NSOrderedSame;
}

@end
