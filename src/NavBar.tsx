import { Logo } from "./Logo";

export function NavBar({ children }: { children: React.ReactNode }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}
