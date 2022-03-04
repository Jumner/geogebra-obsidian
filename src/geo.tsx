import React, { useEffect } from "react";
import Geogebra from "react-geogebra";

export default function Geo() {
	useEffect(() => {
		console.log("Geo instance destroyed");
	}, []);
	return (
		<Geogebra 
			appName="3d"
			width={800}
			height={600}
			showToolBar={false}
			showMenuBar={false}
			appletOnLoad={() => {console.log("Geo Instance")}}
			id="app1"
		/>
	);
}
