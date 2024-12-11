"use client";

import React from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
	return <CountUp duration={1.7} separator=" " decimal="," decimals={2} suffix=" €" end={amount} />;
};

export default AnimatedCounter;
