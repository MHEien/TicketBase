import { Render } from "@measured/puck";
import { config } from "../lib";

export function Renderer({ data }: { data: any }) {
    return <Render config={config} data={data} />;
}
