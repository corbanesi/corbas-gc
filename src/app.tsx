import { TierList } from "./components/tier-list";

function App() {
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
