import { useEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { TierList } from "@/components/tier-list";
import { TailwindIndicator } from "./components/tailwind-indicator";

function App() {
	const [isToastOpen, setToastOpen] = useState(false);

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
					<Toast.ToastProvider swipeDirection="right">
						<TierList setToastOpen={setToastOpen} />

						<Toast.Root
							className="bg-white border rounded-lg shadow p-4 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
							open={isToastOpen}
							onOpenChange={setToastOpen}
						>
							<Toast.Title className="font-medium">Tier list saved</Toast.Title>
							<Toast.Description asChild>
								<div className="text-sm leading-[1.3]">You can refresh the page without losing data</div>
							</Toast.Description>
						</Toast.Root>
						<Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[360px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
					</Toast.ToastProvider>
				</div>
			</div>
			<TailwindIndicator />
		</>
	);
}

export default App;
