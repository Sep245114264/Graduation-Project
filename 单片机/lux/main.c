#include <reg52.h>

sbit I2C_SCL = P1^1;
sbit I2C_SDA = P1^0;

void I2C_delay10us(void)
{
	int n = 10;
	while( n-- );
}

void I2C_Start(void)
{
	I2C_SDA = 1;
	I2C_delay10us();
	I2C_SCL = 1;
	I2C_delay10us();
	I2C_SDA = 0;
	I2C_delay10us();
	I2C_SCL = 0;
	I2C_delay10us();
}

void I2C_Stop(void)
{
	I2C_SDA = 0;
	I2C_delay10us();
	I2C_SCL = 1;
	I2C_delay10us();
	I2C_SDA = 1;
	I2C_delay10us();
}

void I2C_Ack(char ackbit)
{
	if (ackbit)
	{
		I2C_SDA = 0;
	}
	else
	{
		I2C_SDA = 1;
	}
	I2C_delay10us();
	I2C_SCL = 1;
	I2C_delay10us();
	I2C_SCL = 0;
	I2C_SDA = 1;
	I2C_delay10us();
}

bit I2C_WaitAck(void)
{
	I2C_SDA = 1;
	I2C_delay10us();
	I2C_SCL = 1;
	I2C_delay10us();
	if (I2C_SDA)
	{
		I2C_SCL = 0;
		I2C_Stop();
		return 0;
	}
	else
	{
		I2C_SCL = 0;
		return 1;
	}
}

void I2C_SendByte(char byte)
{
	char i;
	for( i = 0; i < 8; ++i )
	{
		if (byte & 0x80)
		{
			I2C_SDA = 1;
		}
		else
		{
			I2C_SDA = 0;
		}
		I2C_delay10us();
		I2C_SCL = 1;
		byte <<= 1;
		I2C_delay10us();
		I2C_SCL = 0;
	}
}

char I2C_RecByte(void)
{
	char da, i;

	for( i= 0; i < 8; ++i )
	{
		I2C_SCL = 1;
		I2C_delay10us();
		da <<= 1;
		if( SDA )
		{
			da |= 0x01;
		}
		I2C_SCL = 0;
		I2C_delay10us();
	}
	return da;
}