import * as React from "react";
import { useEffect } from "react";
import Geogebra from "react-geogebra";

declare global {
	interface Window {
		app1: any;
	}
}

export default function Geo() {
	return (
		<Geogebra 
			appName="3d"
			width={800}
			height={600}
			showToolBar={false}
			showMenuBar={false}
			appletOnLoad={() => {
				console.log("Geo Instance");
				setInterval(() => {
					if (window.app1) {
						console.log(window.app1.getBase64());
					}
				}, 1000);
			}}
			id="app1"
		/>
	);
}
