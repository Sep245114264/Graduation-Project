#include "system.h"
#include "wifi.c"
#include "I2C.h"
#include "I2C.c"
#include "motor.c"

void delay10us(void);
void delayMs(u16 timers);
void delayUs(u16 timers);  	// 10的倍数
void rstDHT11(void);
void readDHT11(u8 * buf);
u16 calLen(u8 * str);
u8 readDHT11Byte(void);
bit ISendByte(u8 sla,u8 c);
u8 IRcvByte(u8 sla);
u16 count = 0;
void timer1() interrupt 1
{
	u16 lux = 0;
	u16 con = 0;
	u8 recBuf[7];
	TH0 = (65536 - 50000) / 256;
	TL0 = (65536 - 50000) % 256;

	if( count++ == 100)	
	{	
		readDHT11(recBuf);
		ISendByte(PCF8591, 0x01);
		lux = IRcvByte(PCF8591); 
		recBuf[5] = lux;
		ISendByte(PCF8591, 0x00);
		con = IRcvByte(PCF8591);
		recBuf[6] = con;
		sendUart(recBuf, 7);
		count = 0;
	}
}

void main(void)
{
	
	motorStop();
	initUart();
	delayMs(5000);
	sendUart(DEVICE_INFO, calLen(DEVICE_INFO));
	delayMs(5000); 
	ET0 = 1;
	TR0 = 1;
	//sendUart("connect ok\r\n");
	while(1)
	{	
		 //motorData = forward[1];
		if (receiveBuff[0] == 49)
			{
				motorFWD();
			}
			else
			{
				motorStop();
			}
		if (rxFlag)
		{	
			
			//sendUart(receiveBuff, rxCnt+2);
			rxCnt = 0;
			rxFlag = 0;
		}
		//delayMs(5000); 
	}
}

u16 calLen(u8 * str)
{
	u16 count = 0;
	while (*(str++))
	{
		++count;
	}
	return count;
}

void delay10us(void)
{
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	_nop_();
}

void delayUs(u16 timers)
{
	u16 i = 0;
	for(i = 0; i < timers; ++i )
	{
		delay10us();
	}
}

void delayMs(u16 timers)
{
	u16 i = 0;
	u16 j = 0;
	for( i = 0; i < timers; ++i )
	{
		for( j = 0; j < 100; ++j )
		{
		}
	}
}

void rstDHT11(void)
{
	DHT11 = 1;
	_nop_();
	_nop_();
	DHT11 = 0;
	delayMs(20);
	DHT11 = 1;
	delayUs(3);
}

u8 readDHT11Byte(void)
{
	u8 i, dat;
	for( i = 0; i < 8; ++i )
	{
		while(!DHT11);
		delayUs(1);
		dat <<= 1;
		if (DHT11)
		{
			dat += 1;
		}
		while(DHT11);
	}
	return dat;
}
	
void readDHT11(u8 * buf)
{
	u8 i;
	rstDHT11();
	if (!DHT11)
	{
		while (!DHT11);
		delayUs(4);

		for (i = 1; i < 6; ++i)
		{
			buf[i] = readDHT11Byte();
		}
		delayUs(4);
		if (buf[1] + buf[2] + buf[3] + buf[4] == buf[5])
		{
			buf[0] = 1;
			//sendUart(buf, 6);
		}
	}
} 

bit ISendByte(u8 sla,u8 c)
{
   Start_I2c();              //启动总线
   SendByte(sla);            //发送器件地址
   if(ack==0)return(0);
   SendByte(c);              //发送数据
   if(ack==0)return(0);
   Stop_I2c();               //结束总线
   return(1);
}

u8 IRcvByte(u8 sla)
{  unsigned char c;

   Start_I2c();          //启动总线
   SendByte(sla+1);      //发送器件地址
   if(ack==0)return(0);
   c=RcvByte();          //读取数据0

   Ack_I2c(1);           //发送非就答位
   Stop_I2c();           //结束总线
   return(c);
}