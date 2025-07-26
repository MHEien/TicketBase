import { Render } from "@measured/puck";
import { createAdvancedConfig } from "./fields";

export function Renderer({ data }: { data: any }) {
    const config = createAdvancedConfig();
    return <Render config={config} data={data} />;
}
