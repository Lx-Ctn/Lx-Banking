"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
	const data = {
		datasets: [
			{
				label: "Banks",
				data: accounts.map(account => account.currentBalance),
				backgroundColor: ["hsl(160 85% 50%)", "hsl(155 90% 45%)", "hsl(165 95% 40%)"],
			},
		],
		labels: accounts.map(account => account.name),
	};
	return <Doughnut data={data} options={{ cutout: "30%", plugins: { legend: { display: false } } }} />;
};

export default DoughnutChart;
