#include <reg52.h>

typedef unsigned char u8;
typedef unsigned int u16;

sbit led = P1^7;
sbit test = P1^6;

u8 receiveBuff[35] = "OK\n";
u8 state = 0;
u16 rxCnt = 0;
bit rxFlag = 0;

void initUart(void)
{
	TMOD=0x20;
	TH1=0xfD;
	TL1=0xfD;
	TR1=1;
	REN=1;
	SM0=0;
	SM1=1;
	EA=1;
	ES=1;
}	

void delay(void)
{
	int i, j;
	for( i= 0; i < 1000; ++i )
	{
		for( j = 0; j < 1000; ++j )
		{}
	}
}

void sendUartBit(char c)
{
	//ES = 0;
	SBUF = c;
	while( !TI );
	TI = 0;
	//ES = 1;
}

void sendUart(char *str)
{
	while( *str )
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
		rxCnt = 0;
		rxFlag = 1;
	}
	RI = 0;
	/*SBUF = receiveBuff[0];
	while(!TI);
	TI = 0;	 */
	}
	
}

void main(void)
{
	initUart();
	delay();
	sendUart("connect ok\r\n");
	while(1)
	{	
		if( rxFlag )
		{
			sendUart(receiveBuff);
			rxFlag = 0;
		}
		/*sendUart("connect ok\r\n");
		sendUart(receiveBuff);
		delay(); */
	}
	/*while(1)
	{
		sendUart(receiveBuff);
	}*/
	/*while(1)
	{
		if(rxFlag)
		{
			sendUart(receiveBuff);
			rxFlag = 0;
		}
	}*/
}
		