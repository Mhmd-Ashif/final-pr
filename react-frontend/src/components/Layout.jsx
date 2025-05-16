import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/Button";

export default function Layout({ children }) {
  const params = useParams();
  console.log(params);
  return (
    <div className="min-h-screen bg-background text-foreground">

      <main className="w-full">{children}</main>
    </div>
  );
}
