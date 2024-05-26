import { useEffect } from "react";
import { TierList } from "@/components/tier-list";

function App() {
	useEffect(() => {
		const handleUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
		};
		window.addEventListener("beforeunload", handleUnload, { capture: true });
		return () => {
			window.removeEventListener("beforeunload", handleUnload);
		};
	}, []);

	return (
		<>
			<div className="flex min-h-screen px-2 container mx-auto">
				<div className="w-full py-2">
					<TierList />
				</div>
			</div>
		</>
	);
}

export default App;
