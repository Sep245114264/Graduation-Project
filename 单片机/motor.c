u8 forward[4] = {0x08, 0x04, 0x02, 0x01};
u8 reverse[4] = {0x01, 0x02, 0x04, 0x08};

void delayXms(u16 x)
{
	u16 i, j;
	for(i = 0; i < x; ++i)
	{
		for(j = 0; j < 112; ++j);
	}
}

void motorFWD(void)
{
	u16 i;
	for(i = 0; i < 4; ++i)
	{
		motorData = forward[i];
		delayXms(speed);
	}
}	

void motorREV(void)
{
	u16 i;
	for(i = 0; i < 4; ++i )
	{
		motorData = reverse[i];
		delayXms(speed);
	}
}

void motorStop(void)
{
	motorData = 0x00;
}