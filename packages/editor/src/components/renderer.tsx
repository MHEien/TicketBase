import { Render } from "@measured/puck";
import { createAdvancedConfig } from "../lib/config";

export function Renderer({ data }: { data: any }) {
    const config = createAdvancedConfig();
    return <Render config={config} data={data} />;
}
