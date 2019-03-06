#ifndef __SYSTEM_H__
#define __SYSTEM_H__

#include <reg52.h>
#include <intrins.h>

typedef unsigned char u8;
typedef unsigned int u16;

#define PCF8591 0x90

#define TRUE 1
#define FALSE 0
#define DEVICE_INFO "19961113_1\r\n"

sbit DHT11 = P2^7;
#define motorData P0

u16 speed = 5;
#endif