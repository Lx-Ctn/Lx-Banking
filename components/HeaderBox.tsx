import React from "react";

const HeaderBox = ({ type = "title", title, user, subtext }: HeaderBoxProps) => {
	return (
		<hgroup className="header-box">
			<h1 className="header-box-title">
				{title}
				{type === "greeting" && <span className="text-bankGradient">&nbsp;{user}</span>}
				{type === "greeting" && " !"}
			</h1>
			<p className="header-box-subtext">{subtext}</p>
		</hgroup>
	);
};

export default HeaderBox;
