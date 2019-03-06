#include "system.h"

u8 receiveBuff[35] = "OK\n";
u16 rxCnt = 0;
bit rxFlag = 0;

void initUart(void)
{
	TMOD=0x20;
	TMOD |= 0x01;
	TH0 = (65535 - 50000) / 256;
	TL0 = (65535 - 50000) % 256;
	TH1=0xfD;
	TL1=0xfD;
	TR1=1;
	REN=1;
	SM0=0;
	SM1=1;
	EA=1;
	ES=1;
}

void sendUartBit(char c)
{
	//ES = 0;
	SBUF = c;
	while( !TI );
	TI = 0;
	//ES = 1;
}

void sendUart(char *str, int len)
{
	while( len-- )
	{
		sendUartBit(*(str++));
	}
}

void receiveUart(void) interrupt 4
{	 
	if( RI )
	{
		receiveBuff[rxCnt++] = SBUF;
		if(rxCnt == 4 )
		{
			receiveBuff[rxCnt] = '\r';
			receiveBuff[rxCnt+1] = '\n';
			rxFlag = 1;
		}
		RI = 0;
	}
	
}