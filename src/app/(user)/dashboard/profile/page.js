import FintechProfile from "./profile";

export const metadata = {
  title: "Profile",
    robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return <FintechProfile />;
}